
export const convertDriveLink = (link: string): string | null => {
  if (!link) return null;

  // Pattern 1: https://drive.google.com/file/d/VIDEO_ID/view?usp=sharing
  // Pattern 2: https://drive.google.com/open?id=VIDEO_ID
  // Pattern 3: https://drive.google.com/uc?id=VIDEO_ID
  
  let id = '';
  const parts = link.split('/');
  
  // Try to find ID between /d/ and /view
  const dIndex = parts.indexOf('d');
  if (dIndex !== -1 && parts.length > dIndex + 1) {
    id = parts[dIndex + 1];
  } else {
    // Try to find id= query param
    const match = link.match(/id=([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
      id = match[1];
    }
  }

  if (!id) return null;

  // Return direct view URL
  return `https://drive.google.com/uc?export=view&id=${id}`;
};
