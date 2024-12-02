import React from "react";
import dashboard from "../components/assets/Dashboard.jpg";

export default function Phone() {
  return (
    <div class="relative mx-auto border-indigo-500 dark:border-indigo-500 bg-indigo-500 border-[14px] rounded-[2.5rem] h-[600px] w-[300px]">
      <div class="h-[32px] w-[3px] bg-indigo-500 dark:bg-indigo-500 absolute -left-[17px] top-[72px] rounded-l-lg"></div>
      <div class="h-[46px] w-[3px] bg-indigo-500 dark:bg-indigo-500 absolute -left-[17px] top-[124px] rounded-l-lg"></div>
      <div class="h-[46px] w-[3px] bg-indigo-500 dark:bg-indigo-500 absolute -left-[17px] top-[178px] rounded-l-lg"></div>
      <div class="h-[64px] w-[3px] bg-indigo-500 dark:bg-indigo-500 absolute -right-[17px] top-[142px] rounded-r-lg"></div>
      <div class="rounded-[2rem] overflow-hidden w-[272px] h-[572px] bg-white dark:bg-indigo-500">
        <img src={dashboard} class="dark:hidden w-[272px] h-[572px]" alt="" />
        <img
          src={dashboard}
          class="hidden dark:block w-[272px] h-[572px]"
          alt=""
        />
      </div>
    </div>
  );
}
