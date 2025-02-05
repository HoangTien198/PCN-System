USE [master]
GO
/****** Object:  Database [IE_MSC]    Script Date: 2/13/2023 3:35:57 PM ******/
CREATE DATABASE [IE_MSC]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'IE_MSC', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL15.MSSQLSERVER\MSSQL\DATA\IE_MSC.mdf' , SIZE = 8192KB , MAXSIZE = UNLIMITED, FILEGROWTH = 65536KB )
 LOG ON 
( NAME = N'IE_MSC_log', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL15.MSSQLSERVER\MSSQL\DATA\IE_MSC_log.ldf' , SIZE = 73728KB , MAXSIZE = 2048GB , FILEGROWTH = 65536KB )
 WITH CATALOG_COLLATION = DATABASE_DEFAULT
GO
ALTER DATABASE [IE_MSC] SET COMPATIBILITY_LEVEL = 150
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [IE_MSC].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [IE_MSC] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [IE_MSC] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [IE_MSC] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [IE_MSC] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [IE_MSC] SET ARITHABORT OFF 
GO
ALTER DATABASE [IE_MSC] SET AUTO_CLOSE OFF 
GO
ALTER DATABASE [IE_MSC] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [IE_MSC] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [IE_MSC] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [IE_MSC] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [IE_MSC] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [IE_MSC] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [IE_MSC] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [IE_MSC] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [IE_MSC] SET  DISABLE_BROKER 
GO
ALTER DATABASE [IE_MSC] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [IE_MSC] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [IE_MSC] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [IE_MSC] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [IE_MSC] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [IE_MSC] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [IE_MSC] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [IE_MSC] SET RECOVERY FULL 
GO
ALTER DATABASE [IE_MSC] SET  MULTI_USER 
GO
ALTER DATABASE [IE_MSC] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [IE_MSC] SET DB_CHAINING OFF 
GO
ALTER DATABASE [IE_MSC] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [IE_MSC] SET TARGET_RECOVERY_TIME = 60 SECONDS 
GO
ALTER DATABASE [IE_MSC] SET DELAYED_DURABILITY = DISABLED 
GO
ALTER DATABASE [IE_MSC] SET ACCELERATED_DATABASE_RECOVERY = OFF  
GO
EXEC sys.sp_db_vardecimal_storage_format N'IE_MSC', N'ON'
GO
ALTER DATABASE [IE_MSC] SET QUERY_STORE = OFF
GO
USE [IE_MSC]
GO
/****** Object:  User [CPD-AIOT]    Script Date: 2/13/2023 3:35:57 PM ******/
CREATE USER [CPD-AIOT] FOR LOGIN [CPD-AIOT] WITH DEFAULT_SCHEMA=[dbo]
GO
/****** Object:  Table [dbo].[DepartmentConfirms]    Script Date: 2/13/2023 3:35:57 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[DepartmentConfirms](
	[DepartmentID] [char](36) NOT NULL,
	[MSCID] [char](36) NOT NULL,
	[Status] [int] NULL,
	[ConfirmedBy] [char](36) NULL,
	[ConfirmedDate] [datetime] NULL,
	[RejectedBy] [char](36) NULL,
	[RejectedDate] [datetime] NULL,
	[ReasonReject] [ntext] NULL,
 CONSTRAINT [PK_DepartmentConfirm] PRIMARY KEY CLUSTERED 
(
	[DepartmentID] ASC,
	[MSCID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Departments]    Script Date: 2/13/2023 3:35:57 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Departments](
	[DepartmentID] [char](36) NOT NULL,
	[DepartmentName] [nvarchar](50) NULL,
	[Type] [varchar](50) NULL,
	[CreatedDate] [datetime] NULL,
	[UpdatedDate] [datetime] NULL,
	[UpdatedBy] [char](36) NULL,
	[CreatedBy] [char](36) NULL,
 CONSTRAINT [PK_Departments] PRIMARY KEY CLUSTERED 
(
	[DepartmentID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Employees]    Script Date: 2/13/2023 3:35:57 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Employees](
	[EmployeeID] [char](36) NOT NULL,
	[EmployeeCode] [varchar](50) NULL,
	[EmployeeCNName] [nvarchar](50) NULL,
	[EmployeeVNName] [nvarchar](50) NULL,
	[EmployeeAvatar] [nvarchar](255) NULL,
	[Gender] [int] NULL,
	[HireDate] [datetime] NULL,
	[Email] [nvarchar](100) NULL,
	[DeskPhone] [varchar](50) NULL,
	[MobilePhone] [varchar](50) NULL,
	[Position] [int] NULL,
	[DepartmentId] [char](36) NULL,
	[Username] [varchar](50) NULL,
	[Password] [varchar](50) NULL,
	[CreatedDate] [datetime] NULL,
	[UpdatedDate] [datetime] NULL,
	[UpdatedBy] [char](36) NULL,
	[CreatedBy] [char](36) NULL,
	[RoleID] [int] NULL,
	[Status] [int] NULL,
 CONSTRAINT [PK_Employees] PRIMARY KEY CLUSTERED 
(
	[EmployeeID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[MSCs]    Script Date: 2/13/2023 3:35:57 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[MSCs](
	[MSCID] [char](36) NOT NULL,
	[MSCCode] [nvarchar](50) NULL,
	[RecommendedBy] [char](36) NULL,
	[RecommendedDate] [datetime] NULL,
	[Subject] [nvarchar](250) NULL,
	[ProcessTitle] [nvarchar](250) NULL,
	[BeforeChangeDescription] [ntext] NULL,
	[BeforeChangeFile] [nvarchar](max) NULL,
	[ModelTitle] [nvarchar](250) NULL,
	[AfterChangeDescription] [ntext] NULL,
	[AfterChangeFile] [nvarchar](max) NULL,
	[Reason] [ntext] NULL,
	[CalculateCost] [ntext] NULL,
	[EffectiveDate] [datetime] NULL,
	[Status] [int] NULL,
	[IEConfirmBy] [char](36) NULL,
	[IEConfirmDate] [datetime] NULL,
	[BossConfirmBy] [char](36) NULL,
	[BossConfirmDate] [datetime] NULL,
	[IERejectBy] [char](36) NULL,
	[IERejectDate] [datetime] NULL,
	[RejectReason] [ntext] NULL,
	[BossRejectBy] [char](36) NULL,
	[BossRejectDate] [datetime] NULL,
	[CreatedDate] [datetime] NULL,
	[UpdatedDate] [datetime] NULL,
	[UpdatedBy] [char](36) NULL,
	[CreatedBy] [char](36) NULL,
 CONSTRAINT [PK_MSC] PRIMARY KEY CLUSTERED 
(
	[MSCID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Roles]    Script Date: 2/13/2023 3:35:57 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Roles](
	[RoleID] [int] NOT NULL,
	[RoleName] [nchar](10) NULL,
	[CreatedDate] [datetime] NULL,
	[UpdatedDate] [datetime] NULL,
	[UpdatedBy] [char](36) NULL,
	[CreatedBy] [char](36) NULL,
 CONSTRAINT [PK_Roles] PRIMARY KEY CLUSTERED 
(
	[RoleID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
INSERT [dbo].[Departments] ([DepartmentID], [DepartmentName], [Type], [CreatedDate], [UpdatedDate], [UpdatedBy], [CreatedBy]) VALUES (N'0fae23fc-2e43-48b4-806a-06af3d8928ca', N'BOSS', NULL, CAST(N'2023-01-12T13:24:03.663' AS DateTime), NULL, NULL, NULL)
INSERT [dbo].[Departments] ([DepartmentID], [DepartmentName], [Type], [CreatedDate], [UpdatedDate], [UpdatedBy], [CreatedBy]) VALUES (N'131c2a19-5056-4be4-9143-835b14691a6b', N'TE-AUTO', N'NETGEAR', CAST(N'2023-02-09T17:15:20.930' AS DateTime), NULL, NULL, N'ADMIN                               ')
INSERT [dbo].[Departments] ([DepartmentID], [DepartmentName], [Type], [CreatedDate], [UpdatedDate], [UpdatedBy], [CreatedBy]) VALUES (N'274d1fcf-0528-43c0-8873-10f0ca559b60', N'PE', N'NETGEAR', CAST(N'2023-02-09T17:14:38.180' AS DateTime), NULL, NULL, N'ADMIN                               ')
INSERT [dbo].[Departments] ([DepartmentID], [DepartmentName], [Type], [CreatedDate], [UpdatedDate], [UpdatedBy], [CreatedBy]) VALUES (N'431a5706-9978-41e8-a4e8-6698884ab810', N'TE', N'ARLO', CAST(N'2023-01-06T16:21:40.383' AS DateTime), NULL, NULL, NULL)
INSERT [dbo].[Departments] ([DepartmentID], [DepartmentName], [Type], [CreatedDate], [UpdatedDate], [UpdatedBy], [CreatedBy]) VALUES (N'45214731-a871-4ff6-988e-ca11a4bb2ac6', N'QA', N'NETGEAR', CAST(N'2023-02-09T17:13:45.803' AS DateTime), NULL, NULL, N'ADMIN                               ')
INSERT [dbo].[Departments] ([DepartmentID], [DepartmentName], [Type], [CreatedDate], [UpdatedDate], [UpdatedBy], [CreatedBy]) VALUES (N'56f9a62d-c426-43e3-9f16-e624c5bf84e6', N'PD', N'NETGEAR', CAST(N'2023-02-09T17:15:43.193' AS DateTime), NULL, NULL, N'ADMIN                               ')
INSERT [dbo].[Departments] ([DepartmentID], [DepartmentName], [Type], [CreatedDate], [UpdatedDate], [UpdatedBy], [CreatedBy]) VALUES (N'6958fff6-5bb0-42b7-bf68-19eb232b9342', N'IE', N'NETGEAR', CAST(N'2023-01-26T09:31:17.753' AS DateTime), NULL, NULL, N'ADMIN                               ')
INSERT [dbo].[Departments] ([DepartmentID], [DepartmentName], [Type], [CreatedDate], [UpdatedDate], [UpdatedBy], [CreatedBy]) VALUES (N'6ab15b51-5698-44a1-9b4c-317550a8f599', N'TE', N'NETGEAR', CAST(N'2023-01-14T14:19:21.870' AS DateTime), NULL, NULL, N'ADMIN                               ')
INSERT [dbo].[Departments] ([DepartmentID], [DepartmentName], [Type], [CreatedDate], [UpdatedDate], [UpdatedBy], [CreatedBy]) VALUES (N'76e25c14-f0d6-4ce2-b500-bef32f0fb654', N'ME', N'NETGEAR', CAST(N'2023-01-26T09:31:58.650' AS DateTime), NULL, NULL, N'ADMIN                               ')
INSERT [dbo].[Departments] ([DepartmentID], [DepartmentName], [Type], [CreatedDate], [UpdatedDate], [UpdatedBy], [CreatedBy]) VALUES (N'87df1b2e-d667-45e9-be55-86a441441ce8', N'IE', N'ARLO', CAST(N'2023-01-06T16:23:00.580' AS DateTime), NULL, NULL, NULL)
INSERT [dbo].[Departments] ([DepartmentID], [DepartmentName], [Type], [CreatedDate], [UpdatedDate], [UpdatedBy], [CreatedBy]) VALUES (N'9262854e-bdca-48c0-8d27-e3bd988a5753', N'PD', N'ARLO', CAST(N'2023-01-06T16:22:04.827' AS DateTime), NULL, NULL, NULL)
INSERT [dbo].[Departments] ([DepartmentID], [DepartmentName], [Type], [CreatedDate], [UpdatedDate], [UpdatedBy], [CreatedBy]) VALUES (N'99e44581-ff2b-4c93-ad15-b2effa421866', N'ME', N'ARLO', CAST(N'2023-01-06T16:21:50.703' AS DateTime), NULL, NULL, NULL)
INSERT [dbo].[Departments] ([DepartmentID], [DepartmentName], [Type], [CreatedDate], [UpdatedDate], [UpdatedBy], [CreatedBy]) VALUES (N'af52ffbb-0b7c-4fa5-8671-6012cb0d5c78', N'QA', N'ARLO', CAST(N'2023-01-06T16:22:29.450' AS DateTime), NULL, NULL, NULL)
INSERT [dbo].[Departments] ([DepartmentID], [DepartmentName], [Type], [CreatedDate], [UpdatedDate], [UpdatedBy], [CreatedBy]) VALUES (N'cf7a46a0-22fb-43b3-88d3-4ecfcd91d604', N'PE', N'ARLO', CAST(N'2023-01-06T16:21:22.363' AS DateTime), NULL, NULL, NULL)
INSERT [dbo].[Departments] ([DepartmentID], [DepartmentName], [Type], [CreatedDate], [UpdatedDate], [UpdatedBy], [CreatedBy]) VALUES (N'd5496937-63a7-4e95-babb-d43c62b21f59', N'TE-AUTO', N'ARLO', CAST(N'2023-02-09T17:15:25.407' AS DateTime), NULL, NULL, N'ADMIN                               ')
GO
INSERT [dbo].[Employees] ([EmployeeID], [EmployeeCode], [EmployeeCNName], [EmployeeVNName], [EmployeeAvatar], [Gender], [HireDate], [Email], [DeskPhone], [MobilePhone], [Position], [DepartmentId], [Username], [Password], [CreatedDate], [UpdatedDate], [UpdatedBy], [CreatedBy], [RoleID], [Status]) VALUES (N'15fa945a-1f92-4d87-9fa0-601ee92addec', N'F6822215', N'唐少春', N'Allan', NULL, 1, CAST(N'2007-09-14T00:00:00.000' AS DateTime), N'allan.sc.tang@mail.foxconn.com', NULL, NULL, 1, N'76e25c14-f0d6-4ce2-b500-bef32f0fb654', N'F6822215', N'070914', NULL, NULL, NULL, NULL, 3, 1)
INSERT [dbo].[Employees] ([EmployeeID], [EmployeeCode], [EmployeeCNName], [EmployeeVNName], [EmployeeAvatar], [Gender], [HireDate], [Email], [DeskPhone], [MobilePhone], [Position], [DepartmentId], [Username], [Password], [CreatedDate], [UpdatedDate], [UpdatedBy], [CreatedBy], [RoleID], [Status]) VALUES (N'1b8375ca-736c-481b-b94d-1d4bef40af34', N'V0957004', N'黎氏娥', N'Nga', NULL, 1, CAST(N'2019-06-01T00:00:00.000' AS DateTime), N'cpeii-vn-ie@mail.foxconn.com', NULL, NULL, 2, N'6958fff6-5bb0-42b7-bf68-19eb232b9342', N'V0957004', N'190601', NULL, NULL, NULL, NULL, 9, 1)
INSERT [dbo].[Employees] ([EmployeeID], [EmployeeCode], [EmployeeCNName], [EmployeeVNName], [EmployeeAvatar], [Gender], [HireDate], [Email], [DeskPhone], [MobilePhone], [Position], [DepartmentId], [Username], [Password], [CreatedDate], [UpdatedDate], [UpdatedBy], [CreatedBy], [RoleID], [Status]) VALUES (N'2f1f67b4-d08e-494e-995b-300346294e84', N'F6815460', N'高代欣', N'Dai-xin', NULL, 1, CAST(N'2005-07-15T00:00:00.000' AS DateTime), N'dai-xin.gao@fii-foxconn.com', NULL, NULL, 1, N'0fae23fc-2e43-48b4-806a-06af3d8928ca', N'F6815460', N'050715', CAST(N'2023-01-11T08:33:33.143' AS DateTime), NULL, NULL, NULL, 10, 1)
INSERT [dbo].[Employees] ([EmployeeID], [EmployeeCode], [EmployeeCNName], [EmployeeVNName], [EmployeeAvatar], [Gender], [HireDate], [Email], [DeskPhone], [MobilePhone], [Position], [DepartmentId], [Username], [Password], [CreatedDate], [UpdatedDate], [UpdatedBy], [CreatedBy], [RoleID], [Status]) VALUES (N'3e74116c-b133-424c-8faf-e8d6751de0cc', N'V1036158', N'武湯辰', N'Ngô Canh Thìn', NULL, 1, CAST(N'2022-07-16T00:00:00.000' AS DateTime), NULL, NULL, NULL, NULL, N'0fae23fc-2e43-48b4-806a-06af3d8928ca', N'admin', N'Auto123', CAST(N'2023-01-14T10:37:18.187' AS DateTime), NULL, NULL, NULL, 11, 1)
INSERT [dbo].[Employees] ([EmployeeID], [EmployeeCode], [EmployeeCNName], [EmployeeVNName], [EmployeeAvatar], [Gender], [HireDate], [Email], [DeskPhone], [MobilePhone], [Position], [DepartmentId], [Username], [Password], [CreatedDate], [UpdatedDate], [UpdatedBy], [CreatedBy], [RoleID], [Status]) VALUES (N'4577ff83-9dd8-4d6e-b6a2-036604e924cd', N'V0500412', N'李文短', N'Paolo', NULL, 1, CAST(N'2009-05-05T00:00:00.000' AS DateTime), N'paolo.wd.li@mail.foxconn.com', NULL, NULL, 1, N'87df1b2e-d667-45e9-be55-86a441441ce8', N'V0500412', N'090505', CAST(N'2023-01-11T08:33:33.143' AS DateTime), NULL, NULL, NULL, 9, 1)
INSERT [dbo].[Employees] ([EmployeeID], [EmployeeCode], [EmployeeCNName], [EmployeeVNName], [EmployeeAvatar], [Gender], [HireDate], [Email], [DeskPhone], [MobilePhone], [Position], [DepartmentId], [Username], [Password], [CreatedDate], [UpdatedDate], [UpdatedBy], [CreatedBy], [RoleID], [Status]) VALUES (N'48e74880-525d-49a6-a6b1-41fded66a53d', N'810097', N'郭振國', N'Jimkuo', NULL, 1, CAST(N'2004-02-24T00:00:00.000' AS DateTime), N'jimkuo.guo@fii-foxconn.com', NULL, NULL, 1, N'af52ffbb-0b7c-4fa5-8671-6012cb0d5c78', N'810097', N'040224', NULL, NULL, NULL, NULL, 6, 1)
INSERT [dbo].[Employees] ([EmployeeID], [EmployeeCode], [EmployeeCNName], [EmployeeVNName], [EmployeeAvatar], [Gender], [HireDate], [Email], [DeskPhone], [MobilePhone], [Position], [DepartmentId], [Username], [Password], [CreatedDate], [UpdatedDate], [UpdatedBy], [CreatedBy], [RoleID], [Status]) VALUES (N'4b3ad1fc-0688-4968-8fcc-449d3af68861', N'F1313690', N'湯華安', N'Tommy', NULL, 1, CAST(N'2005-07-15T00:00:00.000' AS DateTime), N'tommy.ha.tang@fii-foxconn.com', NULL, NULL, 1, N'6ab15b51-5698-44a1-9b4c-317550a8f599', N'F1313690', N'050715', NULL, NULL, NULL, NULL, 2, 1)
INSERT [dbo].[Employees] ([EmployeeID], [EmployeeCode], [EmployeeCNName], [EmployeeVNName], [EmployeeAvatar], [Gender], [HireDate], [Email], [DeskPhone], [MobilePhone], [Position], [DepartmentId], [Username], [Password], [CreatedDate], [UpdatedDate], [UpdatedBy], [CreatedBy], [RoleID], [Status]) VALUES (N'4ea5c06d-83f3-4c28-8fd0-dab5256bca95', N'F2138552', N'張東磊', N'Dong-lei', NULL, 1, CAST(N'2011-03-20T00:00:00.000' AS DateTime), N'dong-lei.zhang@mail.foxconn.com', NULL, NULL, 1, N'9262854e-bdca-48c0-8d27-e3bd988a5753', N'F2138552', N'110320', CAST(N'2023-01-11T08:33:33.143' AS DateTime), NULL, NULL, NULL, 4, 1)
INSERT [dbo].[Employees] ([EmployeeID], [EmployeeCode], [EmployeeCNName], [EmployeeVNName], [EmployeeAvatar], [Gender], [HireDate], [Email], [DeskPhone], [MobilePhone], [Position], [DepartmentId], [Username], [Password], [CreatedDate], [UpdatedDate], [UpdatedBy], [CreatedBy], [RoleID], [Status]) VALUES (N'5d5a6da2-4d8f-42ae-9f48-1fa5b524c1c5', N'F2138552', N'張東磊', N'Dong-lei', NULL, 1, CAST(N'2011-03-20T00:00:00.000' AS DateTime), N'dong-lei.zhang@mail.foxconn.com', NULL, NULL, 1, N'56f9a62d-c426-43e3-9f16-e624c5bf84e6', N'F2138552', N'110320', NULL, NULL, NULL, NULL, 4, 1)
INSERT [dbo].[Employees] ([EmployeeID], [EmployeeCode], [EmployeeCNName], [EmployeeVNName], [EmployeeAvatar], [Gender], [HireDate], [Email], [DeskPhone], [MobilePhone], [Position], [DepartmentId], [Username], [Password], [CreatedDate], [UpdatedDate], [UpdatedBy], [CreatedBy], [RoleID], [Status]) VALUES (N'673e4b05-842a-4faa-92af-c038977ae30a', N'V0957239', N'阮氏玄', N'Huyen', NULL, 0, CAST(N'2019-06-03T00:00:00.000' AS DateTime), N'cpeii-vn-ie@mail.foxconn.com', NULL, NULL, 2, N'87df1b2e-d667-45e9-be55-86a441441ce8', N'V0957239', N'V0957239', NULL, NULL, NULL, NULL, 9, 1)
INSERT [dbo].[Employees] ([EmployeeID], [EmployeeCode], [EmployeeCNName], [EmployeeVNName], [EmployeeAvatar], [Gender], [HireDate], [Email], [DeskPhone], [MobilePhone], [Position], [DepartmentId], [Username], [Password], [CreatedDate], [UpdatedDate], [UpdatedBy], [CreatedBy], [RoleID], [Status]) VALUES (N'6da962a8-e024-436d-a1f0-0025d6e8e2e3', N'V1036158', N'武湯辰', N'Ngô Canh Thìn', NULL, 1, CAST(N'2022-07-16T00:00:00.000' AS DateTime), NULL, NULL, NULL, 2, N'd5496937-63a7-4e95-babb-d43c62b21f59', N'V1036158', N'220716', NULL, NULL, NULL, NULL, 2, 1)
INSERT [dbo].[Employees] ([EmployeeID], [EmployeeCode], [EmployeeCNName], [EmployeeVNName], [EmployeeAvatar], [Gender], [HireDate], [Email], [DeskPhone], [MobilePhone], [Position], [DepartmentId], [Username], [Password], [CreatedDate], [UpdatedDate], [UpdatedBy], [CreatedBy], [RoleID], [Status]) VALUES (N'820e7e0d-73d3-416e-9a4a-62ea556d2478', N'F6820701', N'夏彬軍', N'Bruce', NULL, 1, CAST(N'2007-07-16T00:00:00.000' AS DateTime), N'bruce.bj.xia@fii-foxconn.com', NULL, NULL, 1, N'99e44581-ff2b-4c93-ad15-b2effa421866', N'F6820701', N'070716', NULL, NULL, NULL, NULL, 3, 1)
INSERT [dbo].[Employees] ([EmployeeID], [EmployeeCode], [EmployeeCNName], [EmployeeVNName], [EmployeeAvatar], [Gender], [HireDate], [Email], [DeskPhone], [MobilePhone], [Position], [DepartmentId], [Username], [Password], [CreatedDate], [UpdatedDate], [UpdatedBy], [CreatedBy], [RoleID], [Status]) VALUES (N'8c4123a5-149b-4c2b-8063-4f0943ba54ff', N'F6817866', N'賀繼裕', N'Joshua', NULL, 1, CAST(N'2007-03-12T00:00:00.000' AS DateTime), N'joshua.jy.he@mail.foxconn.com', NULL, NULL, 1, N'45214731-a871-4ff6-988e-ca11a4bb2ac6', N'F6817866', N'070312', NULL, NULL, NULL, NULL, 6, 1)
INSERT [dbo].[Employees] ([EmployeeID], [EmployeeCode], [EmployeeCNName], [EmployeeVNName], [EmployeeAvatar], [Gender], [HireDate], [Email], [DeskPhone], [MobilePhone], [Position], [DepartmentId], [Username], [Password], [CreatedDate], [UpdatedDate], [UpdatedBy], [CreatedBy], [RoleID], [Status]) VALUES (N'b18ffc1b-0215-4e77-8e8a-0fc4ae64550b', N'F6820701', N'夏彬軍', N'Bruce', NULL, 1, CAST(N'2007-07-16T00:00:00.000' AS DateTime), N'bruce.bj.xia@fii-foxconn.com', NULL, NULL, 1, N'cf7a46a0-22fb-43b3-88d3-4ecfcd91d604', N'F6820701', N'070716', CAST(N'2023-01-06T10:47:07.030' AS DateTime), NULL, NULL, NULL, 1, 1)
INSERT [dbo].[Employees] ([EmployeeID], [EmployeeCode], [EmployeeCNName], [EmployeeVNName], [EmployeeAvatar], [Gender], [HireDate], [Email], [DeskPhone], [MobilePhone], [Position], [DepartmentId], [Username], [Password], [CreatedDate], [UpdatedDate], [UpdatedBy], [CreatedBy], [RoleID], [Status]) VALUES (N'b6ecabf3-5688-40cc-8f87-58da07a8ed99', N'F1311018', N'卓巧靈', N'Attila', NULL, 1, CAST(N'2005-03-11T00:00:00.000' AS DateTime), N'attila.ql.zhuo@mail.foxconn.com', NULL, NULL, 1, N'131c2a19-5056-4be4-9143-835b14691a6b', N'F1311018', N'050311', NULL, NULL, NULL, NULL, 7, 1)
INSERT [dbo].[Employees] ([EmployeeID], [EmployeeCode], [EmployeeCNName], [EmployeeVNName], [EmployeeAvatar], [Gender], [HireDate], [Email], [DeskPhone], [MobilePhone], [Position], [DepartmentId], [Username], [Password], [CreatedDate], [UpdatedDate], [UpdatedBy], [CreatedBy], [RoleID], [Status]) VALUES (N'cc71ca30-1492-41cf-b63f-4f2bf84afa2f', N'V0500412', N'李文短', N'Paolo', NULL, 1, CAST(N'2009-05-05T00:00:00.000' AS DateTime), NULL, NULL, NULL, 1, N'6958fff6-5bb0-42b7-bf68-19eb232b9342', N'V0957239', N'090505', NULL, NULL, NULL, NULL, 9, 1)
INSERT [dbo].[Employees] ([EmployeeID], [EmployeeCode], [EmployeeCNName], [EmployeeVNName], [EmployeeAvatar], [Gender], [HireDate], [Email], [DeskPhone], [MobilePhone], [Position], [DepartmentId], [Username], [Password], [CreatedDate], [UpdatedDate], [UpdatedBy], [CreatedBy], [RoleID], [Status]) VALUES (N'ceca2b70-3858-4453-8e54-4fc09eb22622', N'F1311018', N'卓巧靈', N'Attila', NULL, 1, CAST(N'2005-03-11T00:00:00.000' AS DateTime), N'attila.ql.zhuo@mail.foxconn.com', NULL, NULL, 1, N'd5496937-63a7-4e95-babb-d43c62b21f59', N'F1311018', N'050311', NULL, NULL, NULL, NULL, 7, 1)
INSERT [dbo].[Employees] ([EmployeeID], [EmployeeCode], [EmployeeCNName], [EmployeeVNName], [EmployeeAvatar], [Gender], [HireDate], [Email], [DeskPhone], [MobilePhone], [Position], [DepartmentId], [Username], [Password], [CreatedDate], [UpdatedDate], [UpdatedBy], [CreatedBy], [RoleID], [Status]) VALUES (N'e0d328b2-b319-4303-87ca-ef5338a990cf', N'V0907769', N'阮德盛', N'Mark', NULL, 1, CAST(N'2012-04-02T00:00:00.000' AS DateTime), N'MARK.DS.RUAN@MAIL.FOXCONN.COM', NULL, NULL, 1, N'274d1fcf-0528-43c0-8873-10f0ca559b60', N'V0907769', N'120402', NULL, NULL, NULL, NULL, 1, 1)
INSERT [dbo].[Employees] ([EmployeeID], [EmployeeCode], [EmployeeCNName], [EmployeeVNName], [EmployeeAvatar], [Gender], [HireDate], [Email], [DeskPhone], [MobilePhone], [Position], [DepartmentId], [Username], [Password], [CreatedDate], [UpdatedDate], [UpdatedBy], [CreatedBy], [RoleID], [Status]) VALUES (N'e1f0a811-c8ff-476b-8787-50f1bda4a8d4', N'F6820701', N'夏彬軍', N'Bruce', NULL, 0, CAST(N'2007-07-16T00:00:00.000' AS DateTime), N'bruce.bj.xia@fii-foxconn.com', NULL, NULL, 1, N'431a5706-9978-41e8-a4e8-6698884ab810', N'F6820701', N'070716', CAST(N'2023-01-11T08:33:33.143' AS DateTime), NULL, NULL, NULL, 2, 1)
GO
INSERT [dbo].[Roles] ([RoleID], [RoleName], [CreatedDate], [UpdatedDate], [UpdatedBy], [CreatedBy]) VALUES (1, N'PE        ', CAST(N'2023-01-06T10:40:33.277' AS DateTime), NULL, NULL, NULL)
INSERT [dbo].[Roles] ([RoleID], [RoleName], [CreatedDate], [UpdatedDate], [UpdatedBy], [CreatedBy]) VALUES (2, N'TE        ', CAST(N'2023-01-06T10:40:35.680' AS DateTime), NULL, NULL, NULL)
INSERT [dbo].[Roles] ([RoleID], [RoleName], [CreatedDate], [UpdatedDate], [UpdatedBy], [CreatedBy]) VALUES (3, N'ME        ', CAST(N'2023-01-06T10:40:38.350' AS DateTime), NULL, NULL, NULL)
INSERT [dbo].[Roles] ([RoleID], [RoleName], [CreatedDate], [UpdatedDate], [UpdatedBy], [CreatedBy]) VALUES (4, N'PD        ', CAST(N'2023-01-06T10:40:55.777' AS DateTime), NULL, NULL, NULL)
INSERT [dbo].[Roles] ([RoleID], [RoleName], [CreatedDate], [UpdatedDate], [UpdatedBy], [CreatedBy]) VALUES (5, N'PQE       ', CAST(N'2023-01-06T10:40:57.987' AS DateTime), NULL, NULL, NULL)
INSERT [dbo].[Roles] ([RoleID], [RoleName], [CreatedDate], [UpdatedDate], [UpdatedBy], [CreatedBy]) VALUES (6, N'QA        ', CAST(N'2023-01-06T10:41:11.020' AS DateTime), NULL, NULL, NULL)
INSERT [dbo].[Roles] ([RoleID], [RoleName], [CreatedDate], [UpdatedDate], [UpdatedBy], [CreatedBy]) VALUES (7, N'TE-AUTO   ', CAST(N'2023-01-06T10:41:14.193' AS DateTime), NULL, NULL, NULL)
INSERT [dbo].[Roles] ([RoleID], [RoleName], [CreatedDate], [UpdatedDate], [UpdatedBy], [CreatedBy]) VALUES (8, N'PQC       ', CAST(N'2023-01-06T10:41:15.990' AS DateTime), NULL, NULL, NULL)
INSERT [dbo].[Roles] ([RoleID], [RoleName], [CreatedDate], [UpdatedDate], [UpdatedBy], [CreatedBy]) VALUES (9, N'IE        ', CAST(N'2023-01-06T10:41:23.120' AS DateTime), NULL, NULL, NULL)
INSERT [dbo].[Roles] ([RoleID], [RoleName], [CreatedDate], [UpdatedDate], [UpdatedBy], [CreatedBy]) VALUES (10, N'BOSS      ', CAST(N'2023-01-06T10:41:26.347' AS DateTime), NULL, NULL, NULL)
INSERT [dbo].[Roles] ([RoleID], [RoleName], [CreatedDate], [UpdatedDate], [UpdatedBy], [CreatedBy]) VALUES (11, N'ADMIN     ', CAST(N'2023-01-14T10:33:48.433' AS DateTime), NULL, NULL, NULL)
GO
ALTER TABLE [dbo].[Departments] ADD  CONSTRAINT [DF_Departments_CreatedDate]  DEFAULT (getdate()) FOR [CreatedDate]
GO
ALTER TABLE [dbo].[Employees] ADD  CONSTRAINT [DF_Employees_CreatedDate]  DEFAULT (getdate()) FOR [CreatedDate]
GO
ALTER TABLE [dbo].[MSCs] ADD  CONSTRAINT [DF_MSC_CreatedDate]  DEFAULT (getdate()) FOR [CreatedDate]
GO
ALTER TABLE [dbo].[Roles] ADD  CONSTRAINT [DF_Roles_CreatedDate]  DEFAULT (getdate()) FOR [CreatedDate]
GO
ALTER TABLE [dbo].[DepartmentConfirms]  WITH CHECK ADD  CONSTRAINT [FK_DepartmentConfirm_Departments] FOREIGN KEY([DepartmentID])
REFERENCES [dbo].[Departments] ([DepartmentID])
GO
ALTER TABLE [dbo].[DepartmentConfirms] CHECK CONSTRAINT [FK_DepartmentConfirm_Departments]
GO
ALTER TABLE [dbo].[DepartmentConfirms]  WITH CHECK ADD  CONSTRAINT [FK_DepartmentConfirm_MSC] FOREIGN KEY([MSCID])
REFERENCES [dbo].[MSCs] ([MSCID])
GO
ALTER TABLE [dbo].[DepartmentConfirms] CHECK CONSTRAINT [FK_DepartmentConfirm_MSC]
GO
ALTER TABLE [dbo].[Employees]  WITH CHECK ADD  CONSTRAINT [FK_Employees_Departments] FOREIGN KEY([DepartmentId])
REFERENCES [dbo].[Departments] ([DepartmentID])
GO
ALTER TABLE [dbo].[Employees] CHECK CONSTRAINT [FK_Employees_Departments]
GO
ALTER TABLE [dbo].[Employees]  WITH CHECK ADD  CONSTRAINT [FK_Employees_Roles1] FOREIGN KEY([RoleID])
REFERENCES [dbo].[Roles] ([RoleID])
GO
ALTER TABLE [dbo].[Employees] CHECK CONSTRAINT [FK_Employees_Roles1]
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'DepartmentConfirms', @level2type=N'COLUMN',@level2name=N'DepartmentID'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Trạng thái đơn của bộ phận: 
-1 - Reject,
 1 - Chờ xác nhận,
2 - đã xác nhận,' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'DepartmentConfirms', @level2type=N'COLUMN',@level2name=N'Status'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'ID phòng ban' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'Departments', @level2type=N'COLUMN',@level2name=N'DepartmentID'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Tên phòng ban' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'Departments', @level2type=N'COLUMN',@level2name=N'DepartmentName'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Mã nhân viên' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'Employees', @level2type=N'COLUMN',@level2name=N'EmployeeCode'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Tên tiếng trung' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'Employees', @level2type=N'COLUMN',@level2name=N'EmployeeCNName'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Tên tiếng việt' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'Employees', @level2type=N'COLUMN',@level2name=N'EmployeeVNName'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Ảnh đại diện' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'Employees', @level2type=N'COLUMN',@level2name=N'EmployeeAvatar'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Giới tính: 1-Nam, 0-Nữ, 2: không xác định' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'Employees', @level2type=N'COLUMN',@level2name=N'Gender'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Ngày vào' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'Employees', @level2type=N'COLUMN',@level2name=N'HireDate'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Email' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'Employees', @level2type=N'COLUMN',@level2name=N'Email'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Số máy bàn' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'Employees', @level2type=N'COLUMN',@level2name=N'DeskPhone'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Số máy di dộng' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'Employees', @level2type=N'COLUMN',@level2name=N'MobilePhone'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Chức vụ: 1: Leader , 2: Nhân viên' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'Employees', @level2type=N'COLUMN',@level2name=N'Position'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Trạng thái: 0-vô hiệu hóa, 1-Hoạt động' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'Employees', @level2type=N'COLUMN',@level2name=N'Status'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'ID của đơn MSC' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'MSCs', @level2type=N'COLUMN',@level2name=N'MSCID'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Mã MSC: MSCyyMMddHHmmSSfff' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'MSCs', @level2type=N'COLUMN',@level2name=N'MSCCode'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Người đề nghị' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'MSCs', @level2type=N'COLUMN',@level2name=N'RecommendedBy'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Ngày đề nghị' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'MSCs', @level2type=N'COLUMN',@level2name=N'RecommendedDate'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Chủ đề MSC' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'MSCs', @level2type=N'COLUMN',@level2name=N'Subject'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Tiêu đề quá trình' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'MSCs', @level2type=N'COLUMN',@level2name=N'ProcessTitle'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Mô tả quá trình' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'MSCs', @level2type=N'COLUMN',@level2name=N'BeforeChangeDescription'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Tiêu đề model' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'MSCs', @level2type=N'COLUMN',@level2name=N'ModelTitle'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Mô tả model' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'MSCs', @level2type=N'COLUMN',@level2name=N'AfterChangeDescription'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Nguyên nhân thay đổi' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'MSCs', @level2type=N'COLUMN',@level2name=N'Reason'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Tính toán giá thành sản xuất (by IE Employee)' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'MSCs', @level2type=N'COLUMN',@level2name=N'CalculateCost'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Ngày có hiệu lực' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'MSCs', @level2type=N'COLUMN',@level2name=N'EffectiveDate'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Trạng thái đơn: 
-1 - Đơn bị reject
1 - Chờ các bộ phận xác nhận (bảng Department Confirm)
2 - Chờ nhân viên IE tính toán giá thành sản phẩm (Chờ IE Employee confirm)
3 - Chờ sếp PaoLo xác nhận (Chờ IE Leader confirm)
4 - Chờ sếp Cao xác nhận (Chờ Boss confirm)
5 - Đã được phê duyệt (Boss confirm)' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'MSCs', @level2type=N'COLUMN',@level2name=N'Status'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'1:PE,2: TE, 3:ME, 4:PD, 5:PQE, 6:QA,7:CE/MQA,8,PQC,9:IE-emp, 10:IE-leader, 11:Boss' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'Roles', @level2type=N'COLUMN',@level2name=N'RoleID'
GO
USE [master]
GO
ALTER DATABASE [IE_MSC] SET  READ_WRITE 
GO
