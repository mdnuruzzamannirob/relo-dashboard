import CmsEditorPage from "@/components/common/CmsEditorPage";
import {
  useGetHelpCenterQuery,
  useUpdateHelpCenterMutation,
} from "@/store/apis/cmsApi";

const HelpCenter = () => (
  <CmsEditorPage
    title="Help Center"
    description="Update the information displayed on your public Help Center page."
    emptyMessage="No content yet. Click Edit to add content."
    successMessage="Help Center updated successfully"
    useGetQuery={useGetHelpCenterQuery}
    useUpdateMutation={useUpdateHelpCenterMutation}
  />
);

export default HelpCenter;
