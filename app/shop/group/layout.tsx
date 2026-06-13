// GroupLayout.tsx
import React from "react";

interface IChildren {
  children: React.ReactNode;
}

const GroupLayout: React.FC<IChildren> = ({ children }) => {
  return (
    <div className="px-4 py-4">
      <div className="flex w-full">
        {/* Main Content */}
        <main className="w-full">{children}</main>
      </div>
    </div>
  );
};

export default GroupLayout;
