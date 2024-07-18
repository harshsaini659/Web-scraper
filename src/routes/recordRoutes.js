var express = require('express');
const Record = require('../models/Record');
const { parse } = require('json2csv');
const scapeWebsite = require('../scrape');
var router = express.Router();

router.post("/record", async function (req, res) {
  try {
    const { url } = req.body;
    const existingRecord = await Record.findOne({ url });
    if (existingRecord) {
      return res.status(409).json({ message: "Record already exists" });
    }
    const data = await scapeWebsite(url);
    if (data) {
      const recordData = { ...data, url };
      const record = new Record(recordData);
      await record.save();
      res.status(201).json(record);
    } else {
      res.status(500).json({ message: "Failed to scrape website" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get('/record', async function(req, res) {
    const records = await Record.find();
    res.json(records);
});

// router.delete('record/delete/:id', async function(req, res) {
//     const {id} = req.params;
//     try {
//         const _id = await Record.findOne({_id: id});
//         if (!_id) {
//             console.log('Record not found');
//             res.status(404).json({message: 'Record not found'});
//         } else {
//             console.log('Record found');
//             await Record.findByIdAndDelete(id);
//             console.log('Sending success response'); // Additional logging
//             res.status(200).json({message: 'Record deleted successfully'});
//         }
//     } catch (error) {
//         console.error('Error during record deletion:', error);
//         res.status(500).json({message: 'Internal server error'});
//     }
// });

router.delete('/record/deleteAll', async function(req, res) {
    try {
        await Record.deleteMany();
        res.status(200).json({message: 'All records deleted successfully'});
    } catch (error) {
        console.error('Error during record deletion:', error);
        res.status(500).json({message: 'Internal server error'});
    }
});

router.delete('/record/deleteSelected', async function(req, res) {
    const { ids } = req.body; // Expecting an array of IDs in the request body
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ message: 'Invalid request, array of IDs expected' });
    }

    try {
        const result = await Record.deleteMany({
            _id: { $in: ids }
        });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'No records found to delete' });
        }

        res.status(200).json({ message: `${result.deletedCount} records deleted successfully` });
    } catch (error) {
        console.error('Error deleting selected records:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/record/download', async function(req, res) {
    try {
        const records = await Record.find();
        // Define the fields for the CSV file
        const fields = [
            { label: 'Name', value: 'name' },
            { label: 'Description', value: 'description' },
            { label: 'Company Logo', value: 'companyLogo' },
            { label: 'Facebook URL', value: 'facebookURL' },
            { label: 'LinkedIn URL', value: 'linkedinURL' },
            { label: 'Twitter URL', value: 'twitterURL' },
            { label: 'Instagram URL', value: 'instagramURL' },
            { label: 'Address', value: 'address' },
            { label: 'Phone Number', value: 'phoneNumber' },
            { label: 'Email', value: 'email' }
        ];

        // Convert JSON to CSV
        const csv = parse(records, { fields });

        // Set headers to prompt download with a filename
        res.header('Content-Type', 'text/csv');
        res.attachment('records.csv');
        res.send(csv);
    } catch (error) {
        console.error("Error generating CSV:", error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
