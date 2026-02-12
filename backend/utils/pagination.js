const paginate = async ({
  model,
  query = {},
  sort = { createdAt: -1 },
  page = 1,
  limit = 10,
  select = "",
  populate = "",
}) => {
  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    model
      .find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .select(select)
      .populate(populate),

    model.countDocuments(query),
  ]);

  return {
    data,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNext: page * limit < total,
      hasPrev: page > 1,
    },
  };
};

export default paginate;
