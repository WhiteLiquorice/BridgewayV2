# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `default`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*GetUserProfile*](#getuserprofile)
  - [*GetOrgSettings*](#getorgsettings)
  - [*GetOrgProfiles*](#getorgprofiles)
- [**Mutations**](#mutations)
  - [*UpdateProfileStatus*](#updateprofilestatus)
  - [*CreateOrgProfile*](#createorgprofile)
  - [*UpdateOrgBranding*](#updateorgbranding)
  - [*UpdateOrgSettings*](#updateorgsettings)
  - [*CreateOrg*](#createorg)
  - [*ProvisionProfile*](#provisionprofile)
  - [*ProvisionOrgSetting*](#provisionorgsetting)

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `default`. You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

You can use this generated SDK by importing from the package `@bridgeway/database` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@bridgeway/database';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```typescript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@bridgeway/database';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) from your generated SDK.

# Queries

There are two ways to execute a Data Connect Query using the generated Web SDK:
- Using a Query Reference function, which returns a `QueryRef`
  - The `QueryRef` can be used as an argument to `executeQuery()`, which will execute the Query and return a `QueryPromise`
- Using an action shortcut function, which returns a `QueryPromise`
  - Calling the action shortcut function will execute the Query and return a `QueryPromise`

The following is true for both the action shortcut function and the `QueryRef` function:
- The `QueryPromise` returned will resolve to the result of the Query once it has finished executing
- If the Query accepts arguments, both the action shortcut function and the `QueryRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Query
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `default` connector's generated functions to execute each query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

## GetUserProfile
You can execute the `GetUserProfile` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
getUserProfile(options?: ExecuteQueryOptions): QueryPromise<GetUserProfileData, undefined>;

interface GetUserProfileRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetUserProfileData, undefined>;
}
export const getUserProfileRef: GetUserProfileRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getUserProfile(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<GetUserProfileData, undefined>;

interface GetUserProfileRef {
  ...
  (dc: DataConnect): QueryRef<GetUserProfileData, undefined>;
}
export const getUserProfileRef: GetUserProfileRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getUserProfileRef:
```typescript
const name = getUserProfileRef.operationName;
console.log(name);
```

### Variables
The `GetUserProfile` query has no variables.
### Return Type
Recall that executing the `GetUserProfile` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetUserProfileData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetUserProfileData {
  profiles: ({
    id: UUIDString;
    userId?: string | null;
    role: string;
    fullName?: string | null;
    email?: string | null;
    phone?: string | null;
    isActive?: boolean | null;
    org: {
      id: UUIDString;
      name: string;
      slug?: string | null;
      status?: string | null;
      subscriptionTier?: string | null;
      onboardingComplete?: boolean | null;
    } & Org_Key;
  } & Profile_Key)[];
}
```
### Using `GetUserProfile`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getUserProfile } from '@bridgeway/database';


// Call the `getUserProfile()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getUserProfile();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getUserProfile(dataConnect);

console.log(data.profiles);

// Or, you can use the `Promise` API.
getUserProfile().then((response) => {
  const data = response.data;
  console.log(data.profiles);
});
```

### Using `GetUserProfile`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getUserProfileRef } from '@bridgeway/database';


// Call the `getUserProfileRef()` function to get a reference to the query.
const ref = getUserProfileRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getUserProfileRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.profiles);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.profiles);
});
```

## GetOrgSettings
You can execute the `GetOrgSettings` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
getOrgSettings(vars: GetOrgSettingsVariables, options?: ExecuteQueryOptions): QueryPromise<GetOrgSettingsData, GetOrgSettingsVariables>;

interface GetOrgSettingsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetOrgSettingsVariables): QueryRef<GetOrgSettingsData, GetOrgSettingsVariables>;
}
export const getOrgSettingsRef: GetOrgSettingsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getOrgSettings(dc: DataConnect, vars: GetOrgSettingsVariables, options?: ExecuteQueryOptions): QueryPromise<GetOrgSettingsData, GetOrgSettingsVariables>;

interface GetOrgSettingsRef {
  ...
  (dc: DataConnect, vars: GetOrgSettingsVariables): QueryRef<GetOrgSettingsData, GetOrgSettingsVariables>;
}
export const getOrgSettingsRef: GetOrgSettingsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getOrgSettingsRef:
```typescript
const name = getOrgSettingsRef.operationName;
console.log(name);
```

### Variables
The `GetOrgSettings` query requires an argument of type `GetOrgSettingsVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetOrgSettingsVariables {
  orgId: UUIDString;
}
```
### Return Type
Recall that executing the `GetOrgSettings` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetOrgSettingsData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetOrgSettingsData {
  orgSettings: ({
    paymentRequired?: boolean | null;
    stripeCustomerId?: string | null;
    stripeSubscriptionId?: string | null;
    paymentPastDue?: boolean | null;
    externalCalendarId?: string | null;
    externalCalendarType?: string | null;
    externalCalendarSyncEnabled?: boolean | null;
    disabledWidgets?: unknown | null;
    bookingConfig?: unknown | null;
  })[];
}
```
### Using `GetOrgSettings`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getOrgSettings, GetOrgSettingsVariables } from '@bridgeway/database';

// The `GetOrgSettings` query requires an argument of type `GetOrgSettingsVariables`:
const getOrgSettingsVars: GetOrgSettingsVariables = {
  orgId: ..., 
};

// Call the `getOrgSettings()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getOrgSettings(getOrgSettingsVars);
// Variables can be defined inline as well.
const { data } = await getOrgSettings({ orgId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getOrgSettings(dataConnect, getOrgSettingsVars);

console.log(data.orgSettings);

// Or, you can use the `Promise` API.
getOrgSettings(getOrgSettingsVars).then((response) => {
  const data = response.data;
  console.log(data.orgSettings);
});
```

### Using `GetOrgSettings`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getOrgSettingsRef, GetOrgSettingsVariables } from '@bridgeway/database';

// The `GetOrgSettings` query requires an argument of type `GetOrgSettingsVariables`:
const getOrgSettingsVars: GetOrgSettingsVariables = {
  orgId: ..., 
};

// Call the `getOrgSettingsRef()` function to get a reference to the query.
const ref = getOrgSettingsRef(getOrgSettingsVars);
// Variables can be defined inline as well.
const ref = getOrgSettingsRef({ orgId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getOrgSettingsRef(dataConnect, getOrgSettingsVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.orgSettings);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.orgSettings);
});
```

## GetOrgProfiles
You can execute the `GetOrgProfiles` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
getOrgProfiles(vars: GetOrgProfilesVariables, options?: ExecuteQueryOptions): QueryPromise<GetOrgProfilesData, GetOrgProfilesVariables>;

interface GetOrgProfilesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetOrgProfilesVariables): QueryRef<GetOrgProfilesData, GetOrgProfilesVariables>;
}
export const getOrgProfilesRef: GetOrgProfilesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getOrgProfiles(dc: DataConnect, vars: GetOrgProfilesVariables, options?: ExecuteQueryOptions): QueryPromise<GetOrgProfilesData, GetOrgProfilesVariables>;

interface GetOrgProfilesRef {
  ...
  (dc: DataConnect, vars: GetOrgProfilesVariables): QueryRef<GetOrgProfilesData, GetOrgProfilesVariables>;
}
export const getOrgProfilesRef: GetOrgProfilesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getOrgProfilesRef:
```typescript
const name = getOrgProfilesRef.operationName;
console.log(name);
```

### Variables
The `GetOrgProfiles` query requires an argument of type `GetOrgProfilesVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetOrgProfilesVariables {
  orgId: UUIDString;
}
```
### Return Type
Recall that executing the `GetOrgProfiles` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetOrgProfilesData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetOrgProfilesData {
  profiles: ({
    id: UUIDString;
    userId?: string | null;
    role: string;
    fullName?: string | null;
    email?: string | null;
    phone?: string | null;
    isActive?: boolean | null;
    commissionRatePercentage?: number | null;
  } & Profile_Key)[];
}
```
### Using `GetOrgProfiles`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getOrgProfiles, GetOrgProfilesVariables } from '@bridgeway/database';

// The `GetOrgProfiles` query requires an argument of type `GetOrgProfilesVariables`:
const getOrgProfilesVars: GetOrgProfilesVariables = {
  orgId: ..., 
};

// Call the `getOrgProfiles()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getOrgProfiles(getOrgProfilesVars);
// Variables can be defined inline as well.
const { data } = await getOrgProfiles({ orgId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getOrgProfiles(dataConnect, getOrgProfilesVars);

console.log(data.profiles);

// Or, you can use the `Promise` API.
getOrgProfiles(getOrgProfilesVars).then((response) => {
  const data = response.data;
  console.log(data.profiles);
});
```

### Using `GetOrgProfiles`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getOrgProfilesRef, GetOrgProfilesVariables } from '@bridgeway/database';

// The `GetOrgProfiles` query requires an argument of type `GetOrgProfilesVariables`:
const getOrgProfilesVars: GetOrgProfilesVariables = {
  orgId: ..., 
};

// Call the `getOrgProfilesRef()` function to get a reference to the query.
const ref = getOrgProfilesRef(getOrgProfilesVars);
// Variables can be defined inline as well.
const ref = getOrgProfilesRef({ orgId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getOrgProfilesRef(dataConnect, getOrgProfilesVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.profiles);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.profiles);
});
```

# Mutations

There are two ways to execute a Data Connect Mutation using the generated Web SDK:
- Using a Mutation Reference function, which returns a `MutationRef`
  - The `MutationRef` can be used as an argument to `executeMutation()`, which will execute the Mutation and return a `MutationPromise`
- Using an action shortcut function, which returns a `MutationPromise`
  - Calling the action shortcut function will execute the Mutation and return a `MutationPromise`

The following is true for both the action shortcut function and the `MutationRef` function:
- The `MutationPromise` returned will resolve to the result of the Mutation once it has finished executing
- If the Mutation accepts arguments, both the action shortcut function and the `MutationRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Mutation
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `default` connector's generated functions to execute each mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).

## UpdateProfileStatus
You can execute the `UpdateProfileStatus` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
updateProfileStatus(vars: UpdateProfileStatusVariables): MutationPromise<UpdateProfileStatusData, UpdateProfileStatusVariables>;

interface UpdateProfileStatusRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateProfileStatusVariables): MutationRef<UpdateProfileStatusData, UpdateProfileStatusVariables>;
}
export const updateProfileStatusRef: UpdateProfileStatusRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateProfileStatus(dc: DataConnect, vars: UpdateProfileStatusVariables): MutationPromise<UpdateProfileStatusData, UpdateProfileStatusVariables>;

interface UpdateProfileStatusRef {
  ...
  (dc: DataConnect, vars: UpdateProfileStatusVariables): MutationRef<UpdateProfileStatusData, UpdateProfileStatusVariables>;
}
export const updateProfileStatusRef: UpdateProfileStatusRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateProfileStatusRef:
```typescript
const name = updateProfileStatusRef.operationName;
console.log(name);
```

### Variables
The `UpdateProfileStatus` mutation requires an argument of type `UpdateProfileStatusVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateProfileStatusVariables {
  id: UUIDString;
  isActive: boolean;
}
```
### Return Type
Recall that executing the `UpdateProfileStatus` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateProfileStatusData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateProfileStatusData {
  profile_update?: Profile_Key | null;
}
```
### Using `UpdateProfileStatus`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateProfileStatus, UpdateProfileStatusVariables } from '@bridgeway/database';

// The `UpdateProfileStatus` mutation requires an argument of type `UpdateProfileStatusVariables`:
const updateProfileStatusVars: UpdateProfileStatusVariables = {
  id: ..., 
  isActive: ..., 
};

// Call the `updateProfileStatus()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateProfileStatus(updateProfileStatusVars);
// Variables can be defined inline as well.
const { data } = await updateProfileStatus({ id: ..., isActive: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateProfileStatus(dataConnect, updateProfileStatusVars);

console.log(data.profile_update);

// Or, you can use the `Promise` API.
updateProfileStatus(updateProfileStatusVars).then((response) => {
  const data = response.data;
  console.log(data.profile_update);
});
```

### Using `UpdateProfileStatus`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateProfileStatusRef, UpdateProfileStatusVariables } from '@bridgeway/database';

// The `UpdateProfileStatus` mutation requires an argument of type `UpdateProfileStatusVariables`:
const updateProfileStatusVars: UpdateProfileStatusVariables = {
  id: ..., 
  isActive: ..., 
};

// Call the `updateProfileStatusRef()` function to get a reference to the mutation.
const ref = updateProfileStatusRef(updateProfileStatusVars);
// Variables can be defined inline as well.
const ref = updateProfileStatusRef({ id: ..., isActive: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateProfileStatusRef(dataConnect, updateProfileStatusVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.profile_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.profile_update);
});
```

## CreateOrgProfile
You can execute the `CreateOrgProfile` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
createOrgProfile(vars: CreateOrgProfileVariables): MutationPromise<CreateOrgProfileData, CreateOrgProfileVariables>;

interface CreateOrgProfileRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateOrgProfileVariables): MutationRef<CreateOrgProfileData, CreateOrgProfileVariables>;
}
export const createOrgProfileRef: CreateOrgProfileRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createOrgProfile(dc: DataConnect, vars: CreateOrgProfileVariables): MutationPromise<CreateOrgProfileData, CreateOrgProfileVariables>;

interface CreateOrgProfileRef {
  ...
  (dc: DataConnect, vars: CreateOrgProfileVariables): MutationRef<CreateOrgProfileData, CreateOrgProfileVariables>;
}
export const createOrgProfileRef: CreateOrgProfileRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createOrgProfileRef:
```typescript
const name = createOrgProfileRef.operationName;
console.log(name);
```

### Variables
The `CreateOrgProfile` mutation requires an argument of type `CreateOrgProfileVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateOrgProfileVariables {
  orgId: UUIDString;
  fullName: string;
  email: string;
  role: string;
  commissionRatePercentage: number;
}
```
### Return Type
Recall that executing the `CreateOrgProfile` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateOrgProfileData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateOrgProfileData {
  profile_insert: Profile_Key;
}
```
### Using `CreateOrgProfile`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createOrgProfile, CreateOrgProfileVariables } from '@bridgeway/database';

// The `CreateOrgProfile` mutation requires an argument of type `CreateOrgProfileVariables`:
const createOrgProfileVars: CreateOrgProfileVariables = {
  orgId: ..., 
  fullName: ..., 
  email: ..., 
  role: ..., 
  commissionRatePercentage: ..., 
};

// Call the `createOrgProfile()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createOrgProfile(createOrgProfileVars);
// Variables can be defined inline as well.
const { data } = await createOrgProfile({ orgId: ..., fullName: ..., email: ..., role: ..., commissionRatePercentage: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createOrgProfile(dataConnect, createOrgProfileVars);

console.log(data.profile_insert);

// Or, you can use the `Promise` API.
createOrgProfile(createOrgProfileVars).then((response) => {
  const data = response.data;
  console.log(data.profile_insert);
});
```

### Using `CreateOrgProfile`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createOrgProfileRef, CreateOrgProfileVariables } from '@bridgeway/database';

// The `CreateOrgProfile` mutation requires an argument of type `CreateOrgProfileVariables`:
const createOrgProfileVars: CreateOrgProfileVariables = {
  orgId: ..., 
  fullName: ..., 
  email: ..., 
  role: ..., 
  commissionRatePercentage: ..., 
};

// Call the `createOrgProfileRef()` function to get a reference to the mutation.
const ref = createOrgProfileRef(createOrgProfileVars);
// Variables can be defined inline as well.
const ref = createOrgProfileRef({ orgId: ..., fullName: ..., email: ..., role: ..., commissionRatePercentage: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createOrgProfileRef(dataConnect, createOrgProfileVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.profile_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.profile_insert);
});
```

## UpdateOrgBranding
You can execute the `UpdateOrgBranding` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
updateOrgBranding(vars: UpdateOrgBrandingVariables): MutationPromise<UpdateOrgBrandingData, UpdateOrgBrandingVariables>;

interface UpdateOrgBrandingRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateOrgBrandingVariables): MutationRef<UpdateOrgBrandingData, UpdateOrgBrandingVariables>;
}
export const updateOrgBrandingRef: UpdateOrgBrandingRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateOrgBranding(dc: DataConnect, vars: UpdateOrgBrandingVariables): MutationPromise<UpdateOrgBrandingData, UpdateOrgBrandingVariables>;

interface UpdateOrgBrandingRef {
  ...
  (dc: DataConnect, vars: UpdateOrgBrandingVariables): MutationRef<UpdateOrgBrandingData, UpdateOrgBrandingVariables>;
}
export const updateOrgBrandingRef: UpdateOrgBrandingRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateOrgBrandingRef:
```typescript
const name = updateOrgBrandingRef.operationName;
console.log(name);
```

### Variables
The `UpdateOrgBranding` mutation requires an argument of type `UpdateOrgBrandingVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateOrgBrandingVariables {
  id: UUIDString;
  name: string;
  address?: string | null;
  phone?: string | null;
  website?: string | null;
  primaryColor?: string | null;
  secondaryColor?: string | null;
  logoUrl?: string | null;
  layoutTheme?: string | null;
  appTheme?: string | null;
  sessionTimeoutAdminMin?: number | null;
  sessionTimeoutManagerMin?: number | null;
  sessionTimeoutStaffMin?: number | null;
}
```
### Return Type
Recall that executing the `UpdateOrgBranding` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateOrgBrandingData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateOrgBrandingData {
  org_update?: Org_Key | null;
}
```
### Using `UpdateOrgBranding`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateOrgBranding, UpdateOrgBrandingVariables } from '@bridgeway/database';

// The `UpdateOrgBranding` mutation requires an argument of type `UpdateOrgBrandingVariables`:
const updateOrgBrandingVars: UpdateOrgBrandingVariables = {
  id: ..., 
  name: ..., 
  address: ..., // optional
  phone: ..., // optional
  website: ..., // optional
  primaryColor: ..., // optional
  secondaryColor: ..., // optional
  logoUrl: ..., // optional
  layoutTheme: ..., // optional
  appTheme: ..., // optional
  sessionTimeoutAdminMin: ..., // optional
  sessionTimeoutManagerMin: ..., // optional
  sessionTimeoutStaffMin: ..., // optional
};

// Call the `updateOrgBranding()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateOrgBranding(updateOrgBrandingVars);
// Variables can be defined inline as well.
const { data } = await updateOrgBranding({ id: ..., name: ..., address: ..., phone: ..., website: ..., primaryColor: ..., secondaryColor: ..., logoUrl: ..., layoutTheme: ..., appTheme: ..., sessionTimeoutAdminMin: ..., sessionTimeoutManagerMin: ..., sessionTimeoutStaffMin: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateOrgBranding(dataConnect, updateOrgBrandingVars);

console.log(data.org_update);

// Or, you can use the `Promise` API.
updateOrgBranding(updateOrgBrandingVars).then((response) => {
  const data = response.data;
  console.log(data.org_update);
});
```

### Using `UpdateOrgBranding`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateOrgBrandingRef, UpdateOrgBrandingVariables } from '@bridgeway/database';

// The `UpdateOrgBranding` mutation requires an argument of type `UpdateOrgBrandingVariables`:
const updateOrgBrandingVars: UpdateOrgBrandingVariables = {
  id: ..., 
  name: ..., 
  address: ..., // optional
  phone: ..., // optional
  website: ..., // optional
  primaryColor: ..., // optional
  secondaryColor: ..., // optional
  logoUrl: ..., // optional
  layoutTheme: ..., // optional
  appTheme: ..., // optional
  sessionTimeoutAdminMin: ..., // optional
  sessionTimeoutManagerMin: ..., // optional
  sessionTimeoutStaffMin: ..., // optional
};

// Call the `updateOrgBrandingRef()` function to get a reference to the mutation.
const ref = updateOrgBrandingRef(updateOrgBrandingVars);
// Variables can be defined inline as well.
const ref = updateOrgBrandingRef({ id: ..., name: ..., address: ..., phone: ..., website: ..., primaryColor: ..., secondaryColor: ..., logoUrl: ..., layoutTheme: ..., appTheme: ..., sessionTimeoutAdminMin: ..., sessionTimeoutManagerMin: ..., sessionTimeoutStaffMin: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateOrgBrandingRef(dataConnect, updateOrgBrandingVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.org_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.org_update);
});
```

## UpdateOrgSettings
You can execute the `UpdateOrgSettings` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
updateOrgSettings(vars: UpdateOrgSettingsVariables): MutationPromise<UpdateOrgSettingsData, UpdateOrgSettingsVariables>;

interface UpdateOrgSettingsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateOrgSettingsVariables): MutationRef<UpdateOrgSettingsData, UpdateOrgSettingsVariables>;
}
export const updateOrgSettingsRef: UpdateOrgSettingsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateOrgSettings(dc: DataConnect, vars: UpdateOrgSettingsVariables): MutationPromise<UpdateOrgSettingsData, UpdateOrgSettingsVariables>;

interface UpdateOrgSettingsRef {
  ...
  (dc: DataConnect, vars: UpdateOrgSettingsVariables): MutationRef<UpdateOrgSettingsData, UpdateOrgSettingsVariables>;
}
export const updateOrgSettingsRef: UpdateOrgSettingsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateOrgSettingsRef:
```typescript
const name = updateOrgSettingsRef.operationName;
console.log(name);
```

### Variables
The `UpdateOrgSettings` mutation requires an argument of type `UpdateOrgSettingsVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateOrgSettingsVariables {
  orgId: UUIDString;
  disabledWidgets?: unknown | null;
  bookingConfig?: unknown | null;
}
```
### Return Type
Recall that executing the `UpdateOrgSettings` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateOrgSettingsData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateOrgSettingsData {
  orgSetting_upsert: OrgSetting_Key;
}
```
### Using `UpdateOrgSettings`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateOrgSettings, UpdateOrgSettingsVariables } from '@bridgeway/database';

// The `UpdateOrgSettings` mutation requires an argument of type `UpdateOrgSettingsVariables`:
const updateOrgSettingsVars: UpdateOrgSettingsVariables = {
  orgId: ..., 
  disabledWidgets: ..., // optional
  bookingConfig: ..., // optional
};

// Call the `updateOrgSettings()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateOrgSettings(updateOrgSettingsVars);
// Variables can be defined inline as well.
const { data } = await updateOrgSettings({ orgId: ..., disabledWidgets: ..., bookingConfig: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateOrgSettings(dataConnect, updateOrgSettingsVars);

console.log(data.orgSetting_upsert);

// Or, you can use the `Promise` API.
updateOrgSettings(updateOrgSettingsVars).then((response) => {
  const data = response.data;
  console.log(data.orgSetting_upsert);
});
```

### Using `UpdateOrgSettings`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateOrgSettingsRef, UpdateOrgSettingsVariables } from '@bridgeway/database';

// The `UpdateOrgSettings` mutation requires an argument of type `UpdateOrgSettingsVariables`:
const updateOrgSettingsVars: UpdateOrgSettingsVariables = {
  orgId: ..., 
  disabledWidgets: ..., // optional
  bookingConfig: ..., // optional
};

// Call the `updateOrgSettingsRef()` function to get a reference to the mutation.
const ref = updateOrgSettingsRef(updateOrgSettingsVars);
// Variables can be defined inline as well.
const ref = updateOrgSettingsRef({ orgId: ..., disabledWidgets: ..., bookingConfig: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateOrgSettingsRef(dataConnect, updateOrgSettingsVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.orgSetting_upsert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.orgSetting_upsert);
});
```

## CreateOrg
You can execute the `CreateOrg` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
createOrg(vars: CreateOrgVariables): MutationPromise<CreateOrgData, CreateOrgVariables>;

interface CreateOrgRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateOrgVariables): MutationRef<CreateOrgData, CreateOrgVariables>;
}
export const createOrgRef: CreateOrgRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createOrg(dc: DataConnect, vars: CreateOrgVariables): MutationPromise<CreateOrgData, CreateOrgVariables>;

interface CreateOrgRef {
  ...
  (dc: DataConnect, vars: CreateOrgVariables): MutationRef<CreateOrgData, CreateOrgVariables>;
}
export const createOrgRef: CreateOrgRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createOrgRef:
```typescript
const name = createOrgRef.operationName;
console.log(name);
```

### Variables
The `CreateOrg` mutation requires an argument of type `CreateOrgVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateOrgVariables {
  name: string;
  subscriptionTier: string;
  stripePublishableKey?: string | null;
  email: string;
}
```
### Return Type
Recall that executing the `CreateOrg` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateOrgData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateOrgData {
  org_insert: Org_Key;
}
```
### Using `CreateOrg`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createOrg, CreateOrgVariables } from '@bridgeway/database';

// The `CreateOrg` mutation requires an argument of type `CreateOrgVariables`:
const createOrgVars: CreateOrgVariables = {
  name: ..., 
  subscriptionTier: ..., 
  stripePublishableKey: ..., // optional
  email: ..., 
};

// Call the `createOrg()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createOrg(createOrgVars);
// Variables can be defined inline as well.
const { data } = await createOrg({ name: ..., subscriptionTier: ..., stripePublishableKey: ..., email: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createOrg(dataConnect, createOrgVars);

console.log(data.org_insert);

// Or, you can use the `Promise` API.
createOrg(createOrgVars).then((response) => {
  const data = response.data;
  console.log(data.org_insert);
});
```

### Using `CreateOrg`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createOrgRef, CreateOrgVariables } from '@bridgeway/database';

// The `CreateOrg` mutation requires an argument of type `CreateOrgVariables`:
const createOrgVars: CreateOrgVariables = {
  name: ..., 
  subscriptionTier: ..., 
  stripePublishableKey: ..., // optional
  email: ..., 
};

// Call the `createOrgRef()` function to get a reference to the mutation.
const ref = createOrgRef(createOrgVars);
// Variables can be defined inline as well.
const ref = createOrgRef({ name: ..., subscriptionTier: ..., stripePublishableKey: ..., email: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createOrgRef(dataConnect, createOrgVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.org_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.org_insert);
});
```

## ProvisionProfile
You can execute the `ProvisionProfile` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
provisionProfile(vars: ProvisionProfileVariables): MutationPromise<ProvisionProfileData, ProvisionProfileVariables>;

interface ProvisionProfileRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ProvisionProfileVariables): MutationRef<ProvisionProfileData, ProvisionProfileVariables>;
}
export const provisionProfileRef: ProvisionProfileRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
provisionProfile(dc: DataConnect, vars: ProvisionProfileVariables): MutationPromise<ProvisionProfileData, ProvisionProfileVariables>;

interface ProvisionProfileRef {
  ...
  (dc: DataConnect, vars: ProvisionProfileVariables): MutationRef<ProvisionProfileData, ProvisionProfileVariables>;
}
export const provisionProfileRef: ProvisionProfileRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the provisionProfileRef:
```typescript
const name = provisionProfileRef.operationName;
console.log(name);
```

### Variables
The `ProvisionProfile` mutation requires an argument of type `ProvisionProfileVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ProvisionProfileVariables {
  userId: string;
  orgId: UUIDString;
  fullName: string;
  email: string;
  role: string;
}
```
### Return Type
Recall that executing the `ProvisionProfile` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ProvisionProfileData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ProvisionProfileData {
  profile_insert: Profile_Key;
}
```
### Using `ProvisionProfile`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, provisionProfile, ProvisionProfileVariables } from '@bridgeway/database';

// The `ProvisionProfile` mutation requires an argument of type `ProvisionProfileVariables`:
const provisionProfileVars: ProvisionProfileVariables = {
  userId: ..., 
  orgId: ..., 
  fullName: ..., 
  email: ..., 
  role: ..., 
};

// Call the `provisionProfile()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await provisionProfile(provisionProfileVars);
// Variables can be defined inline as well.
const { data } = await provisionProfile({ userId: ..., orgId: ..., fullName: ..., email: ..., role: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await provisionProfile(dataConnect, provisionProfileVars);

console.log(data.profile_insert);

// Or, you can use the `Promise` API.
provisionProfile(provisionProfileVars).then((response) => {
  const data = response.data;
  console.log(data.profile_insert);
});
```

### Using `ProvisionProfile`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, provisionProfileRef, ProvisionProfileVariables } from '@bridgeway/database';

// The `ProvisionProfile` mutation requires an argument of type `ProvisionProfileVariables`:
const provisionProfileVars: ProvisionProfileVariables = {
  userId: ..., 
  orgId: ..., 
  fullName: ..., 
  email: ..., 
  role: ..., 
};

// Call the `provisionProfileRef()` function to get a reference to the mutation.
const ref = provisionProfileRef(provisionProfileVars);
// Variables can be defined inline as well.
const ref = provisionProfileRef({ userId: ..., orgId: ..., fullName: ..., email: ..., role: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = provisionProfileRef(dataConnect, provisionProfileVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.profile_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.profile_insert);
});
```

## ProvisionOrgSetting
You can execute the `ProvisionOrgSetting` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
provisionOrgSetting(vars: ProvisionOrgSettingVariables): MutationPromise<ProvisionOrgSettingData, ProvisionOrgSettingVariables>;

interface ProvisionOrgSettingRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ProvisionOrgSettingVariables): MutationRef<ProvisionOrgSettingData, ProvisionOrgSettingVariables>;
}
export const provisionOrgSettingRef: ProvisionOrgSettingRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
provisionOrgSetting(dc: DataConnect, vars: ProvisionOrgSettingVariables): MutationPromise<ProvisionOrgSettingData, ProvisionOrgSettingVariables>;

interface ProvisionOrgSettingRef {
  ...
  (dc: DataConnect, vars: ProvisionOrgSettingVariables): MutationRef<ProvisionOrgSettingData, ProvisionOrgSettingVariables>;
}
export const provisionOrgSettingRef: ProvisionOrgSettingRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the provisionOrgSettingRef:
```typescript
const name = provisionOrgSettingRef.operationName;
console.log(name);
```

### Variables
The `ProvisionOrgSetting` mutation requires an argument of type `ProvisionOrgSettingVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ProvisionOrgSettingVariables {
  orgId: UUIDString;
  stripeCustomerId: string;
  stripeSubscriptionId: string;
}
```
### Return Type
Recall that executing the `ProvisionOrgSetting` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ProvisionOrgSettingData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ProvisionOrgSettingData {
  orgSetting_upsert: OrgSetting_Key;
}
```
### Using `ProvisionOrgSetting`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, provisionOrgSetting, ProvisionOrgSettingVariables } from '@bridgeway/database';

// The `ProvisionOrgSetting` mutation requires an argument of type `ProvisionOrgSettingVariables`:
const provisionOrgSettingVars: ProvisionOrgSettingVariables = {
  orgId: ..., 
  stripeCustomerId: ..., 
  stripeSubscriptionId: ..., 
};

// Call the `provisionOrgSetting()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await provisionOrgSetting(provisionOrgSettingVars);
// Variables can be defined inline as well.
const { data } = await provisionOrgSetting({ orgId: ..., stripeCustomerId: ..., stripeSubscriptionId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await provisionOrgSetting(dataConnect, provisionOrgSettingVars);

console.log(data.orgSetting_upsert);

// Or, you can use the `Promise` API.
provisionOrgSetting(provisionOrgSettingVars).then((response) => {
  const data = response.data;
  console.log(data.orgSetting_upsert);
});
```

### Using `ProvisionOrgSetting`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, provisionOrgSettingRef, ProvisionOrgSettingVariables } from '@bridgeway/database';

// The `ProvisionOrgSetting` mutation requires an argument of type `ProvisionOrgSettingVariables`:
const provisionOrgSettingVars: ProvisionOrgSettingVariables = {
  orgId: ..., 
  stripeCustomerId: ..., 
  stripeSubscriptionId: ..., 
};

// Call the `provisionOrgSettingRef()` function to get a reference to the mutation.
const ref = provisionOrgSettingRef(provisionOrgSettingVars);
// Variables can be defined inline as well.
const ref = provisionOrgSettingRef({ orgId: ..., stripeCustomerId: ..., stripeSubscriptionId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = provisionOrgSettingRef(dataConnect, provisionOrgSettingVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.orgSetting_upsert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.orgSetting_upsert);
});
```

