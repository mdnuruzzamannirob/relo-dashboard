import CmsEditorPage from "@/components/common/CmsEditorPage";
import {
  useGetTermsConditionQuery,
  useUpdateTermsConditionMutation,
} from "@/store/apis/cmsApi";

const TermsCondition = () => (
  <CmsEditorPage
    title="Terms & Conditions"
    description="Update the information displayed on your public Terms & Conditions page."
    emptyMessage="No content yet. Click Edit to add content."
    successMessage="Terms & Conditions updated successfully"
    useGetQuery={useGetTermsConditionQuery}
    useUpdateMutation={useUpdateTermsConditionMutation}
  />
);

export default TermsCondition;
