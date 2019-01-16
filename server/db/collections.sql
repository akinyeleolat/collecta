CREATE TABLE IF NOT EXISTS users (
   id  SERIAL PRIMARY KEY,
   branch_name VARCHAR(255) NOT NULL,
   email  VARCHAR(255) NOT NULL UNIQUE,
   telephone  VARCHAR(255) NOT NULL UNIQUE,
   password  VARCHAR(255) NOT NULL,
   image_url  VARCHAR(225) NOT NULL,
   user_status INT NOT NULL,
   created_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
   updated_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS admin_users (
   id  SERIAL PRIMARY KEY,
   firstname  VARCHAR(255) NOT NULL,
   lastname  VARCHAR(255) NOT NULL,
   email  VARCHAR(255) NOT NULL UNIQUE,
   telephone  VARCHAR(255) NOT NULL UNIQUE,
   admin_password  VARCHAR(255) NOT NULL,
   image_url  VARCHAR(225) NOT NULL,
   admin_status INT NOT NULL,
   created_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
   updated_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS collectionsAvailable (
   id SERIAL PRIMARY KEY,
   collections_name VARCHAR(50) NOT NULL UNIQUE,
   collections_details VARCHAR(50) NOT NULL,
   created_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
   updated_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS servicesAvailable (
   id SERIAL PRIMARY KEY,
   services_name VARCHAR(50) NOT NULL UNIQUE,
   services_details VARCHAR(50) NOT NULL,
   created_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
   updated_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS collections(
   id SERIAL PRIMARY KEY,
   branch_id VARCHAR(255) NOT NULL,
   services_id VARCHAR(255) NOT NULL,
   collections_id VARCHAR(50) NOT NULL,
   collections_amount FLOAT NOT NULL,
   service_date  VARCHAR(50) NOT NULL,
   created_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
   updated_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
   -- RELATIONSHIP --
FOREIGN KEY( branch_id ) REFERENCES users( id ) ON DELETE CASCADE,
FOREIGN KEY( services_id ) REFERENCES servicesAvailable( id ) ON DELETE CASCADE,
FOREIGN KEY( collections_id ) REFERENCES collectionsAvailable( id ) ON DELETE CASCADE
);
