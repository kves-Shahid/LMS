import * as ModuleModel from '../models/moduleModel.js';

export const createModule = async (req, res) => {
  const { course_id, title, description, position } = req.body;
  try {
    const id = await ModuleModel.createModule(course_id, title, description, position);
    res.status(201).json({ msg: 'Module created', module_id: id });
  } catch (err) {
    res.status(500).json({ msg: 'Creation failed', error: err.message });
  }
};

export const getModulesByCourse = async (req, res) => {
  const { courseId } = req.params;
  try {
    const modules = await ModuleModel.getModulesByCourse(courseId);
    res.json(modules);
  } catch (err) {
    res.status(500).json({ msg: 'Fetch failed', error: err.message });
  }
};

export const getModuleById = async (req, res) => {
  const { moduleId } = req.params;
  try {
    const module = await ModuleModel.getModuleById(moduleId);
    if (!module) {
      return res.status(404).json({ msg: 'Module not found' });
    }
    res.json(module);
  } catch (err) {
    res.status(500).json({ msg: 'Fetch failed', error: err.message });
  }
};

export const updateModule = async (req, res) => {
  const { moduleId } = req.params;
  const { title, description, position } = req.body;

  try {
    // Check if module exists
    const existingModule = await ModuleModel.getModuleById(moduleId);
    if (!existingModule) {
      return res.status(404).json({ msg: 'Module not found' });
    }

    const updates = { title, description, position };
    const isUpdated = await ModuleModel.updateModule(moduleId, updates);

    if (isUpdated) {
      
      const updatedModule = await ModuleModel.getModuleById(moduleId);
      res.json({ msg: 'Module updated successfully', module: updatedModule });
    } else {
      res.status(400).json({ msg: 'Failed to update module' });
    }
  } catch (err) {
    res.status(500).json({ msg: 'Update failed', error: err.message });
  }
};

export const deleteModule = async (req, res) => {
  const { moduleId } = req.params;

  try {
    
    const existingModule = await ModuleModel.getModuleById(moduleId);
    if (!existingModule) {
      return res.status(404).json({ msg: 'Module not found' });
    }

    const isDeleted = await ModuleModel.deleteModule(moduleId);
    if (isDeleted) {
      res.json({ msg: 'Module deleted successfully' });
    } else {
      res.status(400).json({ msg: 'Failed to delete module' });
    }
  } catch (err) {
    res.status(500).json({ msg: 'Deletion failed', error: err.message });
  }
};