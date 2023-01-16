const express = require("express");
const router = express.Router();
var fetchuser = require("../middleware/fetchuser");
const Notes = require("../models/Notes");
const { body, validationResult } = require("express-validator");

// ROUTE 1: Get all the notes
router.get("/fetchallnotes", fetchuser, async (req, res) => {
  try {
    const notes = await Notes.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Some Error occured");
  }
});

// ROUTE 2: Add a new note using POST
router.post("/addnote",fetchuser,
  [
    body("title", "Enter a valid title").isLength({ min: 4 }),
    body("description", "Description must be atleast 5 character").isLength({min: 4})
  ],
  async (req, res) => {
    try {
      const { title, description, tag } = req.body;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const note = new Notes({
        title,
        description,
        tag,
        user: req.user.id,
      });
      const savedNote = await note.save();

      res.json(savedNote);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Some Error occured");
    }
  }
);
// ROUTE 3: Update an existing note using 
router.put("/updatenote/:id",fetchuser, async(req,res) =>{
    const {title, description, tag} = req.body;
    // Creae a new note
    const newNote = {};
    if(title){newNote.title= title};
    if(description){newNote.description= description};
    if(tag){newNote.tag= tag};

    // Find the note to be updated
    let note = await Notes.findById(req.params.id);
    if(!note){return res.status(404).send("Not Found")}
    if(note.user.toString() !== req.user.id){return res.status(401).send("Not Allowed")}

    note = await Notes.findByIdAndUpdate(req.params.id, {$set: newNote}, {new:true})
    res.json({note})
})

// ROUTE 4: delete an existing note using 
router.delete("/deletenote/:id",fetchuser, async(req,res) =>{
  
  // Find the note to be deleted
  let note = await Notes.findById(req.params.id);
  if(!note){return res.status(404).send("Not Found")}
  // Allow deletion only if user owns this note
  if(note.user.toString() !== req.user.id){return res.status(401).send("Not Allowed")}

  note = await Notes.findByIdAndDelete(req.params.id)
  res.json({"Success": "Note has been deleted", note:note});
})

module.exports = router;
