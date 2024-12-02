import React from "react";

export default function Stats() {
  return (
    <div class="py-10 sm:py-12">
      <div class="mx-auto max-w-7xl px-6 lg:px-8">
        <dl class="grid grid-cols-1 gap-x-8 gap-y-16 text-center lg:grid-cols-3">
          <div class="mx-auto flex max-w-xs flex-col gap-y-4">
            <dt class="text-base leading-7 text-gray-800">
              Course Recommendations
            </dt>
            <dd class="order-first text-3xl  tracking-tight text-gray-900 sm:text-5xl">
              User Centric
            </dd>
          </div>
          <div class="mx-auto flex max-w-xs flex-col gap-y-4">
            <dt class="text-base leading-7 text-gray-800">
              Course Recommendations
            </dt>
            <dd class="order-first text-3xl tracking-tight text-gray-900 sm:text-5xl">
              Graph Neural Network
            </dd>
          </div>
          <div class="mx-auto flex max-w-xs flex-col gap-y-4">
            <dt class="text-base leading-7 text-gray-800">
              Resolves User Queries
            </dt>
            <dd class="order-first text-3xl tracking-tight text-gray-800 sm:text-5xl">
              GenAI Chatbot
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
