import { ReactGoogleReviews } from "react-google-reviews";
import "react-google-reviews/dist/index.css";

function Reviews() {
  // Create a free Featurable account at https://featurable.com
  // Then create a new Featurable widget and copy the widget ID
  const featurableWidgetId = "806e1882-029c-4d23-abdf-d8ae34917291";

  return (
    <ReactGoogleReviews layout="carousel" featurableId={featurableWidgetId} />
  );
}
export default Reviews;
