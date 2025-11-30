const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
const Employee = require('../models/Employee');

// Shape helper: convert _id -> employee_id and return only required fields
function toPublic(e) {
  return {
    employee_id: e._id.toString(),
    first_name: e.first_name,
    last_name: e.last_name,
    email: e.email,
    position: e.position,
    salary: e.salary,
    date_of_joining: e.date_of_joining,
    department: e.department,
    profile_picture: e.profile_picture || null
  };
}

// GET /api/v1/emp/employees (200)
async function listEmployees(req, res, next) {
  try {
    const all = await Employee.find().sort({ created_at: -1 });
    return res.status(200).json(all.map(toPublic));
  } catch (err) {
    next(err);
  }
}

// POST /api/v1/emp/employees (201)
async function createEmployee(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ status: false, message: errors.array()[0].msg });
    }

    // 👇 NEW: build data object and plug in profile_picture if a file was uploaded
    const data = { ...req.body };

    if (req.file) {
      data.profile_picture = `/uploads/${req.file.filename}`;
    }

    const emp = await Employee.create(data);

    return res.status(201).json({
      message: 'Employee created successfully.',
      employee_id: emp._id.toString()
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/v1/emp/employees/:eid (200)
async function getEmployee(req, res, next) {
  try {
    const { eid } = req.params;
    if (!mongoose.isValidObjectId(eid)) {
      return res
        .status(400)
        .json({ status: false, message: 'Invalid employee id' });
    }

    const emp = await Employee.findById(eid);
    if (!emp) {
      return res
        .status(404)
        .json({ status: false, message: 'Employee not found' });
    }

    return res.status(200).json(toPublic(emp));
  } catch (err) {
    next(err);
  }
}

// PUT /api/v1/emp/employees/:eid (200)
async function updateEmployee(req, res, next) {
  try {
    const { eid } = req.params;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ status: false, message: errors.array()[0].msg });
    }

    // 👇 NEW: merge body + optional profile picture
    const updateFields = { ...req.body };

    if (req.file) {
      updateFields.profile_picture = `/uploads/${req.file.filename}`;
    }

    const emp = await Employee.findByIdAndUpdate(eid, updateFields, {
      new: true
    });

    if (!emp) {
      return res
        .status(404)
        .json({ status: false, message: 'Employee not found' });
    }

    return res
      .status(200)
      .json({ message: 'Employee details updated successfully.' });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/v1/emp/employees?eid=xxx (204)
async function deleteEmployee(req, res, next) {
  try {
    const { eid } = req.query;
    if (!eid || !mongoose.isValidObjectId(eid)) {
      return res
        .status(400)
        .json({ status: false, message: 'Invalid employee id' });
    }

    await Employee.findByIdAndDelete(eid);
    // Per assignment: 204 with NO body
    return res.status(204).send();
  } catch (err) {
    next(err);
  }
}

// 👇 NEW: GET /api/v1/emp/employees/search?department=...&position=...
async function searchEmployees(req, res, next) {
  try {
    const { department, position } = req.query;
    const filter = {};

    if (department && department.trim() !== '') {
      filter.department = { $regex: department.trim(), $options: 'i' };
    }
    if (position && position.trim() !== '') {
      filter.position = { $regex: position.trim(), $options: 'i' };
    }

    // If no valid filters were provided, just return all (safety fallback)
    const employees =
      Object.keys(filter).length > 0
        ? await Employee.find(filter).sort({ created_at: -1 })
        : await Employee.find().sort({ created_at: -1 });

    return res.status(200).json(employees.map(toPublic));
  } catch (err) {
    next(err);
  }
}

module.exports = {
  listEmployees,
  createEmployee,
  getEmployee,
  updateEmployee,
  deleteEmployee,
  searchEmployees      // 👈 don’t forget this
};
