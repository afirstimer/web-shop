import e from "express";
import prisma from "../lib/prisma.js";
import bcrypt from "bcrypt";

export const getUsers = async (req, res) => {
  try {    
    const { page = 1, limit = process.env.DEFAULT_LIMIT, username, email, sort } = req.query;

    const pageNum = parseInt(page, 10);
    const pageSize = parseInt(limit, 10);

    const where = {
      ...(username && {
        username: {
          contains: username,
          mode: "insensitive",
        },
      }),
      ...(email && {
        email: {
          contains: email,
          mode: "insensitive",
        },
      })      
    };

    const orderBy = (() => {
      switch (sort) {
        case "newest":
          return { createdAt: "desc" };
        case "oldest":
          return { createdAt: "asc" };
        case "updated_newest":
          return { updatedAt: "desc" };
        case "updated_oldest":
          return { updatedAt: "asc" };
        default:
          return { createdAt: "desc" };
      }
    })();

    const total = await prisma.user.count({
      where
    });

    const users = await prisma.user.findMany(
      {
        where,
        skip: (pageNum - 1) * pageSize,
        take: pageSize,
        orderBy: orderBy,
        include: {
          Team: {
            select: {
              name: true,
            },
          },
          shops: {
            select: {
              id: true,
              name: true,
            },
          }
        }
      }
    );

    res.status(200).json({
      total,
      page: pageNum,
      limit: pageSize,
      users
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get users!" });
  }
};

export const getUsersByTeamID = async (req, res) => {
  const {teamId} = req.params;
  console.log(teamId);
  try {
    const team = await prisma.team.findUnique({
      where: {id: teamId}
    });
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }
    const userIds = team.members;  
    
    console.log(userIds);

    const users = []
    for (const userId of userIds) {
      const user = await prisma.user.findUnique({
        where: {id: userId}
      });
      users.push(user);
    }

    console.log(users);
    res.status(200).json(users);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get users!" });
  }
};

export const getUser = async (req, res) => {
  const id = req.params.id;
  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });
    res.status(200).json(user);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get user!" });
  }
};

export const createUser = async (req, res) => {
  const { password, avatar, shops, ...inputs } = req.body;

  // console.log(req.body);

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    let shopIds = [];
    if (shops) {
      shopIds = JSON.parse(shops);
    }

    const validShops = await prisma.shop.findMany({
      where: {
        id: {
          in: shopIds,
        },
      },
      select: {
        id: true,
      },
    });

    // create a new user and save to DB
    const newUser = await prisma.user.create({
      data: {
       ...inputs,
        ...(shops && {
          shops: {
            connect: validShops.map((shopId) => (shopId))
          }
        }),
        ...(password && { password: hashedPassword }),
        ...(avatar && { avatar }),
      },
    });

    // db operation
    console.log(newUser);

    res.status(201).json({
      message: "User created successfully",
    })
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Failed to create user!",
    })
  }
}

export const updateUser = async (req, res) => {
  const id = req.params.id;
  const tokenUserId = req.userId;
  const { password, avatar, shops, ...inputs } = req.body;

  // if (id !== tokenUserId) {
  //   return res.status(403).json({ message: "Not Authorized!" });
  // }

  let updatedPassword = null;
  try {
    if (password) {
      updatedPassword = await bcrypt.hash(password, 10);
    }

    let shopIds = [];
    if (shops) {
      shopIds = JSON.parse(shops);
    }

    const validShops = await prisma.shop.findMany({
      where: {
        id: {
          in: shopIds,
        },
      },
      select: {
        id: true,
      },
    });


    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        ...inputs,
        ...(shops && {
          shops: {
            connect: validShops.map((shopId) => (shopId))
          }
        }),
        ...(updatedPassword && { password: updatedPassword }),
        ...(avatar && { avatar }),
      },
    });

    const { password: userPassword, ...rest } = updatedUser;

    res.status(200).json(rest);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to update users!" });
  }
};

export const deleteUser = async (req, res) => {
  const id = req.params.id;
  const tokenUserId = req.userId;  

  try {
    await prisma.user.update({
      where: { id },
      data: {
        isActive: 0
      }
    });
    res.status(200).json({ message: "User deleted" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to delete users!" });
  }
};

export const deleteMultiUsers = async (req, res) => {
  try {
    const { userIds } = req.body;

    if (!userIds) {
      throw new Error("Vui lồng chọn người dung");
    }

    const parsedUserIds = JSON.parse(userIds);

    for (const userId of parsedUserIds) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          isActive: 0
        }
      });
    }

    res.status(200).json({ message: "Users deleted" });
  } catch (error) {
    console.log(error);
  }
}

export const addUsersToGroup = async (req, res) => {
  try {
    const {userIds, teamId} = req.body;

    if (!userIds || !teamId) {
      throw new Error("Vui lồng chọn nhóm");
    }

    const usersParsed = JSON.parse(userIds);
    console.log(usersParsed);

    // loop usersParsed and find user by id and update teamId
    for (const userId of usersParsed) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          teamId,
        },
      });
    }

    res.status(200).json({ message: "Users added to group" });
  } catch (error) {
    console.log(error);
  }
}

export const savePost = async (req, res) => {
  const postId = req.body.postId;
  const tokenUserId = req.userId;

  try {
    const savedPost = await prisma.savedPost.findUnique({
      where: {
        userId_postId: {
          userId: tokenUserId,
          postId,
        },
      },
    });

    if (savedPost) {
      await prisma.savedPost.delete({
        where: {
          id: savedPost.id,
        },
      });
      res.status(200).json({ message: "Post removed from saved list" });
    } else {
      await prisma.savedPost.create({
        data: {
          userId: tokenUserId,
          postId,
        },
      });
      res.status(200).json({ message: "Post saved" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to delete users!" });
  }
};

export const profilePosts = async (req, res) => {
  const tokenUserId = req.userId;
  try {
    const userPosts = await prisma.post.findMany({
      where: { userId: tokenUserId },
    });
    const saved = await prisma.savedPost.findMany({
      where: { userId: tokenUserId },
      include: {
        post: true,
      },
    });

    const savedPosts = saved.map((item) => item.post);
    res.status(200).json({ userPosts, savedPosts });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get profile posts!" });
  }
};

export const getNotificationNumber = async (req, res) => {
  const tokenUserId = req.userId;
  try {
    const number = await prisma.chat.count({
      where: {
        userIDs: {
          hasSome: [tokenUserId],
        },
        NOT: {
          seenBy: {
            hasSome: [tokenUserId],
          },
        },
      },
    });
    res.status(200).json(number);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get profile posts!" });
  }
};