import Constants from "expo-constants";

// Function to resolve the image URL
export const resolveImageUrl = (path) => {
  const ImageUrl = Constants.expoConfig.extra.ImageUrl;
  if (!path)
    return "https://res.cloudinary.com/dweesppci/image/upload/v1746204369/wtmpcphfvexcq2ubcss0.png%27";
  return path.startsWith("http") ? path : `${ImageUrl}/${path}`;
};

export default resolveImageUrl;
