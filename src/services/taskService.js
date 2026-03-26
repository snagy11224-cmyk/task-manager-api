const {PrismaClient} = require('@prisma/client'); 
const { PrismaPg } = require('@prisma/adapter-pg');

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });


// 1. Create a new task in the database with the provided data and userId.  
// 2. Return the created task object.
const createTask = async (data, userId) => {
  return await prisma.task.create({
    data: { ...data, userId }
  })
}

// 1. Retrieve tasks from the database that belong to the specified userId, and optionally filter by status and priority if provided in the query parameters.
// 2. Return the list of tasks sorted by creation date in descending order.
const getTasks = async (userId, { status, priority }) => {
  const where = { userId }
  if (status) where.status = status
  if (priority) where.priority = priority

  return await prisma.task.findMany({ where, orderBy: { createdAt: 'desc' } })
}

// 1. Retrieve a task by its ID from the database.
// 2. If the task does not exist, throw an error.
// 3. If the task exists but does not belong to the specified userId, throw an error.
// 4. If the task exists and belongs to the specified userId, return the task object.
const getTaskById = async (id, userId) => {
  const task = await prisma.task.findUnique({ where: { id } })
  if (!task) throw new Error('Task not found')
  if (task.userId !== userId) throw new Error('Not authorized')
  return task
}

// 1. Update a task by its ID in the database with the provided data, but only if it belongs to the specified userId.
// 2. If the task does not exist, throw an error.
// 3. If the task exists but does not belong to the specified userId, throw an error.
// 4. If the task exists and belongs to the specified userId, return the updated task object.
const updateTask = async (id, userId, data) => {
  await getTaskById(id, userId)
  return await prisma.task.update({ where: { id }, data })
}

// 1. Delete a task by its ID from the database, but only if it belongs to the specified userId.
// 2. If the task does not exist, throw an error.
// 3. If the task exists but does not belong to the specified userId, throw an error.
// 4. If the task exists and belongs to the specified userId, delete the task and return a success message.
const deleteTask = async (id, userId) => {
  await getTaskById(id, userId)
  return await prisma.task.delete({ where: { id } })
}

module.exports = { createTask, getTasks, getTaskById, updateTask, deleteTask }