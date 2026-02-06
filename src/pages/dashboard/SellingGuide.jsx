import CmsEditorPage from "@/components/common/CmsEditorPage";
import {
  useGetSellingGuideQuery,
  useUpdateSellingGuideMutation,
} from "@/store/apis/cmsApi";

const SellingGuide = () => (
  <CmsEditorPage
    title="Selling Guide"
    description="Update the information displayed on your public Selling Guide page."
    emptyMessage="No content yet. Click Edit to add content."
    successMessage="Selling Guide updated successfully"
    useGetQuery={useGetSellingGuideQuery}
    useUpdateMutation={useUpdateSellingGuideMutation}
  />
);

export default SellingGuide;
