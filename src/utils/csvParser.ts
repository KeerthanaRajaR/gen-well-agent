import { User } from "@/types/user";

export const parseCSV = async (csvText: string): Promise<User[]> => {
  const lines = csvText.trim().split('\n');
  const headers = lines[0].split(',');
  
  return lines.slice(1).map(line => {
    const values = line.split(',');
    const user: any = {};
    
    headers.forEach((header, index) => {
      const key = header.trim();
      let value: any = values[index]?.trim() || '';
      
      // Parse numeric fields
      if (key === 'user_id' || key === 'latest_cgm') {
        value = parseInt(value, 10);
      }
      
      user[key] = value;
    });
    
    return user as User;
  });
};
