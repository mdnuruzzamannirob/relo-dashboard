import CmsEditorPage from "@/components/common/CmsEditorPage";
import {
  useGetPrivacyPolicyQuery,
  useUpdatePrivacyPolicyMutation,
} from "@/store/apis/cmsApi";

const PrivacyPolicy = () => (
  <CmsEditorPage
    title="Privacy Policy"
    description="Update the information displayed on your public Privacy Policy page."
    emptyMessage="No content yet. Click Edit to add content."
    successMessage="Privacy Policy updated successfully"
    useGetQuery={useGetPrivacyPolicyQuery}
    useUpdateMutation={useUpdatePrivacyPolicyMutation}
  />
);

export default PrivacyPolicy;
