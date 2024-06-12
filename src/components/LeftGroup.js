import { useState } from "react";

export default function LeftGroup(props) {
  const items = ["balanceOf", "transfer", "approval", "allowance"];
  const [current, setCurrent] = useState("balanceOf");
  return (
    <div className="w-48 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
      {items.map((item, ind) => 
        <a
          href="#"
          key={ind}
          onClick={() => setCurrent(item)}
          aria-current={item === current}
          className="block w-full px-4 py-2 text-white bg-blue-700 border-b border-gray-200 rounded-t-lg cursor-pointer dark:bg-gray-800 dark:border-gray-600"
        >
          {item}
        </a>
      )}
    </div>
  );
}
