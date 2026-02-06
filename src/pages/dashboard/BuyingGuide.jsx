import CmsEditorPage from "@/components/common/CmsEditorPage";
import {
  useGetBuyingGuideQuery,
  useUpdateBuyingGuideMutation,
} from "@/store/apis/cmsApi";

const BuyingGuide = () => (
  <CmsEditorPage
    title="Buying Guide"
    description="Update the information displayed on your public Buying Guide page."
    emptyMessage="No content yet. Click Edit to add content."
    successMessage="Buying Guide updated successfully"
    useGetQuery={useGetBuyingGuideQuery}
    useUpdateMutation={useUpdateBuyingGuideMutation}
  />
);

export default BuyingGuide;
