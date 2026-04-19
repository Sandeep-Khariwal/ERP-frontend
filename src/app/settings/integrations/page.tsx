import { Suspense } from "react";
import { Center, Loader } from "@mantine/core";
import { IntegrationsCallbackContent } from "@/app/components/marketing/IntegrationCallbackContent";

// useSearchParams() MUST be wrapped in Suspense in Next.js 14 App Router
export default function SettingsIntegrationsPage() {
  return (
    <Suspense
      fallback={
        <Center h="80vh">
          <Loader size="md" />
        </Center>
      }
    >
      <IntegrationsCallbackContent />
    </Suspense>
  );
}