import { ObjectId } from "mongodb";
import express from 'express';
const router = express.Router();

async function createEmployeeController(req: any, res: any) {
  try {
    const db = req.app.locals.db;
    const { name, email, phone, address } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    if (phone && phone.length > 10) {
      return res.status(400).json({ message: 'Phone number cannot be longer than 10 digits' });
    }
    
    if (address && address.length > 100) {
      return res.status(400).json({ message: 'Address must be less than 100 characters' });
    }

    // check if employee exists

    const existingEmployee = await db.collection('employees').findOne({
      email: email.toLowerCase()
    });

    if (existingEmployee) {
      return res.status(400).json({ message: 'Employee already exists' });
    }

    const result = await db.collection('employees').insertOne({
      name,
      email: email.toLowerCase(),
      phone,
      address
    });

    if (result.acknowledged) {
      res.status(200).json({ message: 'Employee created' });
    } else {
      throw new Error('Employee not created');
    }

  }
  catch(error) {
    res.status(500).json({ error: error.toString() });
  }
}

async function getEmployeeController(req: any, res: any) {
  try {
      const db = req.app.locals.db;

      const id: string = req.params.id;
      console.log("Id -> ", id);

      if (!id) {
          return res.status(400).json({ message: 'Employee ID is required' });
      }

      // Validate the ObjectId format
      if (!ObjectId.isValid(id)) {
          return res.status(400).json({ message: 'Invalid Employee ID format' });
      }

      const result = await db.collection('employees').findOne({
          _id: new ObjectId(id)
      });

      if (!result) {
          return res.status(404).json({ message: 'Employee not found' });
      }

      res.status(200).json({
          message: "Employee retrieved",
          employee: result
      });
  } catch (error) {
      res.status(500).json({ error: error.toString() });
  }
}

async function getEmployeesController(req: any, res: any) {
  try {
    const db = req.app.locals.db;

    const result = await db.collection('employees').find().toArray();

    res.status(200).json({
      message: "Employee retrieved",
      employees: result
    });

  }
  catch(error) {
    res.status(500).json({ error: error.toString() });
  }
}

async function deleteEmployeeController(req: any, res: any) {
  try {
    const db = req.app.locals.db;
    const id: string = req.params.id;

    if (!id) {
      return res.status(400).json({ message: 'Employee ID is required' });
    }

    // Validate the ObjectId format
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid Employee ID format' });
    }

    const result = await db.collection('employees').deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.status(200).json({ message: 'Employee deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
}

router.delete('/:id', deleteEmployeeController);
router.post('/', createEmployeeController);
router.get('/:id', getEmployeeController);
router.get('/', getEmployeesController);

module.exports = router;