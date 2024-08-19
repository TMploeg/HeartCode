export default function useProfilePicture() {
  return function getProfilePictureURL(id: string) {
    return (
      import.meta.env.VITE_API_URL +
      "users/profilepictures/" +
      id +
      "?" +
      Date.now()
    );
  };
}
