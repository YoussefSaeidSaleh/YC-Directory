import React from "react";

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const id = (await params).id;
  console.log("id =>", id);

  return <div>pagesdfsd</div>;
};

export default page;
