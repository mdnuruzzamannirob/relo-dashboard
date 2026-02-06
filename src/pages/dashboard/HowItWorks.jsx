import CmsEditorPage from "@/components/common/CmsEditorPage";
import {
  useGetHowItWorksQuery,
  useUpdateHowItWorksMutation,
} from "@/store/apis/cmsApi";

const HowItWorks = () => (
  <CmsEditorPage
    title="How It Works"
    description="Update the information displayed on your public How It Works page."
    emptyMessage="No content yet. Click Edit to add content."
    successMessage="How It Works updated successfully"
    useGetQuery={useGetHowItWorksQuery}
    useUpdateMutation={useUpdateHowItWorksMutation}
  />
);

export default HowItWorks;
