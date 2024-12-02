export const generateRandomRoomId = () => {
    const a: string =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
    const n = a.length;
    let randomRoomId = "";
    for (let i = 0; i < 10; i++) {
      const randomIndex = Math.floor(Math.random() * n);
      randomRoomId += a[randomIndex % n];
    }
    console.log("randomRoomId: ", randomRoomId);
    return randomRoomId;
  };