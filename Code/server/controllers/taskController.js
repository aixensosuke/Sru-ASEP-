const Task = require('../models/Task');

exports.createTask = async (req, res) => {
    try {
        const task = new Task({
            user: req.user.id,
            ...req.body
        });
        await task.save();
        res.status(201).json(task);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateTask = async (req, res) => {
    try {
        let task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ message: 'Task not found' });
        if (task.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }
        
        task = await Task.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        res.json(task);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};
