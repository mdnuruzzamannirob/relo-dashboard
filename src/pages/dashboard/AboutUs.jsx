import CmsEditorPage from "@/components/common/CmsEditorPage";
import {
  useGetAboutUsQuery,
  useUpdateAboutUsMutation,
} from "@/store/apis/cmsApi";

const AboutUs = () => (
  <CmsEditorPage
    title="About Us"
    description="Update the information displayed on your public About page."
    emptyMessage="No content yet. Click Edit to add content."
    successMessage="About Us updated successfully"
    useGetQuery={useGetAboutUsQuery}
    useUpdateMutation={useUpdateAboutUsMutation}
  />
);

export default AboutUs;
