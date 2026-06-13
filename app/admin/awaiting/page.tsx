"use client";
import { Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { AwaitingList } from "@/components/admin/order/Awaitinglist";
import { useAdminGuard } from "@/hooks/useAdminGuard";

const AwaitingContent: React.FC = () => {
  useAdminGuard();
  const searchParams = useSearchParams();
  const pageParam = searchParams.get("page");

  const currentPage = useMemo(() => {
    const parsed = parseInt(pageParam || "1", 10);
    return isNaN(parsed) || parsed < 1 ? 1 : parsed;
  }, [pageParam]);

  return <AwaitingList page={currentPage} />;
};

const AwaitingPage: React.FC = () => {
  return (
    <Suspense fallback={<div>در حال بارگذاری...</div>}>
      <AwaitingContent />
    </Suspense>
  );
};

export default AwaitingPage;