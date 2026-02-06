import CmsEditorPage from "@/components/common/CmsEditorPage";
import {
  useGetTrustSafetyQuery,
  useUpdateTrustSafetyMutation,
} from "@/store/apis/cmsApi";

const TrustSafety = () => (
  <CmsEditorPage
    title="Trust & Safety"
    description="Update the information displayed on your public Trust & Safety page."
    emptyMessage="No content yet. Click Edit to add content."
    successMessage="Trust & Safety updated successfully"
    useGetQuery={useGetTrustSafetyQuery}
    useUpdateMutation={useUpdateTrustSafetyMutation}
  />
);

export default TrustSafety;
