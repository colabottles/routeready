export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  // Validate required fields
  if (!body.name || !body.type || !body.address || !body.size || !body.frequency || !body.priority) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing required fields'
    })
  }

  // In a real app, insert into your database:
  /*
  const result = await event.context.db.query(
    `INSERT INTO properties
    (name, address, type, size, icon, frequency, priority, start_date, preferred_time,
     contact_name, contact_phone, contact_email, access_instructions, special_requirements, status, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
    [
      body.name,
      body.address,
      body.type,
      body.size,
      body.icon || '🏢',
      body.frequency,
      body.priority,
      body.startDate || null,
      body.preferredTime || null,
      body.contactName || null,
      body.contactPhone || null,
      body.contactEmail || null,
      body.accessInstructions || null,
      body.specialRequirements || null,
      body.status || 'active'
    ]
  )

  const propertyId = result.insertId
  */

  // Mock response for development
  const propertyId = Math.floor(Math.random() * 10000)

  const newProperty = {
    id: propertyId,
    name: body.name,
    address: body.address,
    type: body.type,
    size: body.size,
    icon: body.icon || '🏢',
    frequency: body.frequency,
    priority: body.priority,
    startDate: body.startDate || null,
    preferredTime: body.preferredTime || null,
    contactName: body.contactName || null,
    contactPhone: body.contactPhone || null,
    contactEmail: body.contactEmail || null,
    accessInstructions: body.accessInstructions || null,
    specialRequirements: body.specialRequirements || null,
    status: body.status || 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }

  return {
    success: true,
    data: newProperty,
    message: 'Property created successfully'
  }
})