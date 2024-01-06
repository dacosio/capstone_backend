const cron = require("node-cron");
const fs = require("fs");
const path = require("path");

// Schedule file deletion at midnight every day
const every30Sec = "30 * * * * *";
const midnight = "0 0 * * *";

cron.schedule(midnight, () => {
  const dirPath = path.join(__dirname, "..", "logs");
  console.log("Scheduler is running");
  // Read the files in the directory
  fs.readdir(dirPath, (err, files) => {
    if (err) {
      console.error(`Error reading directory: ${err}`);
      return;
    }

    // Iterate through the files and delete them one by one
    files.forEach((file) => {
      const filePath = path.join(dirPath, file);
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error(`Error deleting file ${filePath}: ${err}`);
        } else {
          console.log(`File ${filePath} deleted successfully`);
        }
      });
    });
  });
});
