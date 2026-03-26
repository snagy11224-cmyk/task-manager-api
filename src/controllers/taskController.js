const { createTask, getTasks, getTaskById, updateTask, deleteTask } = require('../services/taskService')

// 1. Call the createTask service function with the request body and userId from the request object.
// 2. If the task creation is successful, return a 201 status code with the created task object.
// 3. If there is an error, return a 400 status code with the error message.
const create = async (req, res) => {
  try {
    const task = await createTask(req.body, req.userId)
    res.status(201).json(task)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// 1. Call the getTasks service function with the userId from the request object and query parameters for filtering.
// 2. If the retrieval is successful, return a 200 status code with the list of tasks.
// 3. If there is an error, return a 500 status code with the error message.
const getAll = async (req, res) => {
  try {
    const tasks = await getTasks(req.userId, req.query)
    res.json(tasks)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// 1. Call the getTaskById service function with the task ID from the request parameters and userId from the request object.
// 2. If the retrieval is successful, return a 200 status code with the task object.
// 3. If there is an error (e.g., task not found or not authorized), return a 404 status code with the error message.
const getOne = async (req, res) => {
  try {
    const task = await getTaskById(Number(req.params.id), req.userId)
    res.json(task)
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}

// 1. Call the updateTask service function with the task ID from the request parameters, userId from the request object, and the request body for updated data.
// 2. If the update is successful, return a 200 status code with the updated task object.
// 3. If there is an error (e.g., task not found, not authorized, or validation error), return a 400 status code with the error message.
const update = async (req, res) => {
  try {
    const task = await updateTask(Number(req.params.id), req.userId, req.body)
    res.json(task)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}


// 1. Call the deleteTask service function with the task ID from the request parameters and userId from the request object.     
// 2. If the deletion is successful, return a 200 status code with a success message.
// 3. If there is an error (e.g., task not found or not authorized), return a 400 status code with the error message.
const remove = async (req, res) => {
  try {
    await deleteTask(Number(req.params.id), req.userId)
    res.json({ message: 'Task deleted successfully' })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

module.exports = { create, getAll, getOne, update, remove }