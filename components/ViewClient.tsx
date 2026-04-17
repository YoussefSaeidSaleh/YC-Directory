"use client";

import Ping from "@/components/Ping";
import { incrementStartupViews } from "@/lib/actions";
import { useEffect, useState } from "react";

const VIEW_LOCK_CLEANUP_DELAY_MS = 1500;

type ActiveVisitEntry = {
  cleanupTimer?: ReturnType<typeof setTimeout>;
  displayedViews: number;
};

const activeVisits = new Map<string, ActiveVisitEntry>();

const getInitialDisplayedViews = (id: string, initialViews: number) => {
  const activeVisit = activeVisits.get(id);
  return activeVisit
    ? Math.max(activeVisit.displayedViews, initialViews)
    : initialViews;
};

const clearScheduledCleanup = (activeVisit: ActiveVisitEntry) => {
  if (!activeVisit.cleanupTimer) return;
  clearTimeout(activeVisit.cleanupTimer);
  activeVisit.cleanupTimer = undefined;
};

const ViewClient = ({
  id,
  initialViews,
}: {
  id: string;
  initialViews: number;
}) => {
  const [views, setViews] = useState(() =>
    getInitialDisplayedViews(id, initialViews),
  );

  useEffect(() => {
    const existingVisit = activeVisits.get(id);

    if (existingVisit) {
      clearScheduledCleanup(existingVisit);
      return () => {
        existingVisit.cleanupTimer = setTimeout(() => {
          activeVisits.delete(id);
        }, VIEW_LOCK_CLEANUP_DELAY_MS);
      };
    }

    const nextViews = initialViews + 1;
    const activeVisit: ActiveVisitEntry = {
      displayedViews: nextViews,
    };

    activeVisits.set(id, activeVisit);

    const incrementView = async () => {
      setViews(nextViews);
      try {
        await incrementStartupViews(id);
        activeVisit.displayedViews = nextViews;
      } catch (error) {
        activeVisits.delete(id);
        setViews(initialViews);
        console.error("Failed to increment startup views", error);
      }
    };

    void incrementView();

    return () => {
      activeVisit.cleanupTimer = setTimeout(() => {
        activeVisits.delete(id);
      }, VIEW_LOCK_CLEANUP_DELAY_MS);
    };
  }, [id, initialViews]);

  return (
    <div className="view-container mr-32">
      <div className="absolute top-2 -right-2">
        <Ping />
      </div>
      <p className="view-text">
        <span className="font-black" suppressHydrationWarning>
          Views: {views}
        </span>
      </p>
    </div>
  );
};

export default ViewClient;
