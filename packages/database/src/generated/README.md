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
  - [*GetAdminDashboardStats*](#getadmindashboardstats)
  - [*GetBookingPageData*](#getbookingpagedata)
  - [*GetAppointmentsForDay*](#getappointmentsforday)
  - [*GetBookingById*](#getbookingbyid)
  - [*GetUpcomingBookings*](#getupcomingbookings)
  - [*GetClientByEmail*](#getclientbyemail)
  - [*GetClientByPhone*](#getclientbyphone)
  - [*GetClientAppointments*](#getclientappointments)
  - [*GetOrgAppointments*](#getorgappointments)
  - [*GetActiveServices*](#getactiveservices)
  - [*SearchClients*](#searchclients)
  - [*GetOrgClients*](#getorgclients)
  - [*GetClientDetail*](#getclientdetail)
  - [*GetOrgQueue*](#getorgqueue)
  - [*GetUpcomingOrgAppointments*](#getupcomingorgappointments)
  - [*GetSlotsForDay*](#getslotsforday)
  - [*GetActivePackageTemplates*](#getactivepackagetemplates)
  - [*GetInAppNotifications*](#getinappnotifications)
- [**Mutations**](#mutations)
  - [*UpdateProfileStatus*](#updateprofilestatus)
  - [*CreateOrgProfile*](#createorgprofile)
  - [*UpdateOrgBranding*](#updateorgbranding)
  - [*UpdateOrgSettings*](#updateorgsettings)
  - [*CreateOrg*](#createorg)
  - [*ProvisionProfile*](#provisionprofile)
  - [*ProvisionOrgSetting*](#provisionorgsetting)
  - [*CreateBooking*](#createbooking)
  - [*UpdateBooking*](#updatebooking)
  - [*UpdateOrgGoogleCalendar*](#updateorggooglecalendar)
  - [*UpdateAppointmentStatus*](#updateappointmentstatus)
  - [*CreateAppointment*](#createappointment)
  - [*CreateService*](#createservice)
  - [*CreateClient*](#createclient)
  - [*UpdateClient*](#updateclient)
  - [*CreateQueueEntry*](#createqueueentry)
  - [*UpdateQueueStatus*](#updatequeuestatus)
  - [*DeleteQueueEntry*](#deletequeueentry)
  - [*CreateClientPackage*](#createclientpackage)
  - [*LogActivity*](#logactivity)
  - [*MarkNotificationRead*](#marknotificationread)

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
    stripeAccountId?: string | null;
    paymentPastDue?: boolean | null;
    externalCalendarId?: string | null;
    externalCalendarType?: string | null;
    externalCalendarSyncEnabled?: boolean | null;
    disabledWidgets?: unknown | null;
    bookingConfig?: unknown | null;
    allowPhotoUpload?: boolean | null;
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

## GetAdminDashboardStats
You can execute the `GetAdminDashboardStats` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
getAdminDashboardStats(vars: GetAdminDashboardStatsVariables, options?: ExecuteQueryOptions): QueryPromise<GetAdminDashboardStatsData, GetAdminDashboardStatsVariables>;

interface GetAdminDashboardStatsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetAdminDashboardStatsVariables): QueryRef<GetAdminDashboardStatsData, GetAdminDashboardStatsVariables>;
}
export const getAdminDashboardStatsRef: GetAdminDashboardStatsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getAdminDashboardStats(dc: DataConnect, vars: GetAdminDashboardStatsVariables, options?: ExecuteQueryOptions): QueryPromise<GetAdminDashboardStatsData, GetAdminDashboardStatsVariables>;

interface GetAdminDashboardStatsRef {
  ...
  (dc: DataConnect, vars: GetAdminDashboardStatsVariables): QueryRef<GetAdminDashboardStatsData, GetAdminDashboardStatsVariables>;
}
export const getAdminDashboardStatsRef: GetAdminDashboardStatsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getAdminDashboardStatsRef:
```typescript
const name = getAdminDashboardStatsRef.operationName;
console.log(name);
```

### Variables
The `GetAdminDashboardStats` query requires an argument of type `GetAdminDashboardStatsVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetAdminDashboardStatsVariables {
  orgId: UUIDString;
  thirtyDaysAgo: TimestampString;
  sevenDaysAgo: TimestampString;
  todayStart: TimestampString;
  todayEnd: TimestampString;
}
```
### Return Type
Recall that executing the `GetAdminDashboardStats` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetAdminDashboardStatsData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetAdminDashboardStatsData {
  profiles: ({
    id: UUIDString;
  } & Profile_Key)[];
  clients: ({
    id: UUIDString;
  } & Client_Key)[];
  appointments: ({
    id: UUIDString;
  } & Appointment_Key)[];
  services: ({
    id: UUIDString;
  } & Service_Key)[];
  activityLogs: ({
    id: UUIDString;
    action: string;
    createdAt: TimestampString;
    userId?: string | null;
  } & ActivityLog_Key)[];
  recentClients: ({
    id: UUIDString;
  } & Client_Key)[];
  recentAppts: ({
    id: UUIDString;
    status: string;
    amount?: number | null;
    createdAt: TimestampString;
    cancellationReason?: string | null;
  } & Appointment_Key)[];
  weekAppts: ({
    id: UUIDString;
    amount?: number | null;
    scheduledAt: TimestampString;
  } & Appointment_Key)[];
  todayAppts: ({
    id: UUIDString;
    amount?: number | null;
    status: string;
  } & Appointment_Key)[];
}
```
### Using `GetAdminDashboardStats`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getAdminDashboardStats, GetAdminDashboardStatsVariables } from '@bridgeway/database';

// The `GetAdminDashboardStats` query requires an argument of type `GetAdminDashboardStatsVariables`:
const getAdminDashboardStatsVars: GetAdminDashboardStatsVariables = {
  orgId: ..., 
  thirtyDaysAgo: ..., 
  sevenDaysAgo: ..., 
  todayStart: ..., 
  todayEnd: ..., 
};

// Call the `getAdminDashboardStats()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getAdminDashboardStats(getAdminDashboardStatsVars);
// Variables can be defined inline as well.
const { data } = await getAdminDashboardStats({ orgId: ..., thirtyDaysAgo: ..., sevenDaysAgo: ..., todayStart: ..., todayEnd: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getAdminDashboardStats(dataConnect, getAdminDashboardStatsVars);

console.log(data.profiles);
console.log(data.clients);
console.log(data.appointments);
console.log(data.services);
console.log(data.activityLogs);
console.log(data.recentClients);
console.log(data.recentAppts);
console.log(data.weekAppts);
console.log(data.todayAppts);

// Or, you can use the `Promise` API.
getAdminDashboardStats(getAdminDashboardStatsVars).then((response) => {
  const data = response.data;
  console.log(data.profiles);
  console.log(data.clients);
  console.log(data.appointments);
  console.log(data.services);
  console.log(data.activityLogs);
  console.log(data.recentClients);
  console.log(data.recentAppts);
  console.log(data.weekAppts);
  console.log(data.todayAppts);
});
```

### Using `GetAdminDashboardStats`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getAdminDashboardStatsRef, GetAdminDashboardStatsVariables } from '@bridgeway/database';

// The `GetAdminDashboardStats` query requires an argument of type `GetAdminDashboardStatsVariables`:
const getAdminDashboardStatsVars: GetAdminDashboardStatsVariables = {
  orgId: ..., 
  thirtyDaysAgo: ..., 
  sevenDaysAgo: ..., 
  todayStart: ..., 
  todayEnd: ..., 
};

// Call the `getAdminDashboardStatsRef()` function to get a reference to the query.
const ref = getAdminDashboardStatsRef(getAdminDashboardStatsVars);
// Variables can be defined inline as well.
const ref = getAdminDashboardStatsRef({ orgId: ..., thirtyDaysAgo: ..., sevenDaysAgo: ..., todayStart: ..., todayEnd: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getAdminDashboardStatsRef(dataConnect, getAdminDashboardStatsVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.profiles);
console.log(data.clients);
console.log(data.appointments);
console.log(data.services);
console.log(data.activityLogs);
console.log(data.recentClients);
console.log(data.recentAppts);
console.log(data.weekAppts);
console.log(data.todayAppts);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.profiles);
  console.log(data.clients);
  console.log(data.appointments);
  console.log(data.services);
  console.log(data.activityLogs);
  console.log(data.recentClients);
  console.log(data.recentAppts);
  console.log(data.weekAppts);
  console.log(data.todayAppts);
});
```

## GetBookingPageData
You can execute the `GetBookingPageData` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
getBookingPageData(vars: GetBookingPageDataVariables, options?: ExecuteQueryOptions): QueryPromise<GetBookingPageDataData, GetBookingPageDataVariables>;

interface GetBookingPageDataRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetBookingPageDataVariables): QueryRef<GetBookingPageDataData, GetBookingPageDataVariables>;
}
export const getBookingPageDataRef: GetBookingPageDataRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getBookingPageData(dc: DataConnect, vars: GetBookingPageDataVariables, options?: ExecuteQueryOptions): QueryPromise<GetBookingPageDataData, GetBookingPageDataVariables>;

interface GetBookingPageDataRef {
  ...
  (dc: DataConnect, vars: GetBookingPageDataVariables): QueryRef<GetBookingPageDataData, GetBookingPageDataVariables>;
}
export const getBookingPageDataRef: GetBookingPageDataRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getBookingPageDataRef:
```typescript
const name = getBookingPageDataRef.operationName;
console.log(name);
```

### Variables
The `GetBookingPageData` query requires an argument of type `GetBookingPageDataVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetBookingPageDataVariables {
  slug: string;
}
```
### Return Type
Recall that executing the `GetBookingPageData` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetBookingPageDataData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetBookingPageDataData {
  orgs: ({
    id: UUIDString;
    name: string;
    logoUrl?: string | null;
    primaryColor?: string | null;
    secondaryColor?: string | null;
    layoutTheme?: string | null;
    appTheme?: string | null;
    stripePublishableKey?: string | null;
    services_on_org: ({
      id: UUIDString;
      name: string;
      description?: string | null;
      durationMinutes?: number | null;
      price?: number | null;
    } & Service_Key)[];
    orgSetting_on_org?: {
      paymentRequired?: boolean | null;
      externalCalendarSyncEnabled?: boolean | null;
      stripeAccountId?: string | null;
      bookingConfig?: unknown | null;
      allowPhotoUpload?: boolean | null;
    };
  } & Org_Key)[];
}
```
### Using `GetBookingPageData`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getBookingPageData, GetBookingPageDataVariables } from '@bridgeway/database';

// The `GetBookingPageData` query requires an argument of type `GetBookingPageDataVariables`:
const getBookingPageDataVars: GetBookingPageDataVariables = {
  slug: ..., 
};

// Call the `getBookingPageData()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getBookingPageData(getBookingPageDataVars);
// Variables can be defined inline as well.
const { data } = await getBookingPageData({ slug: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getBookingPageData(dataConnect, getBookingPageDataVars);

console.log(data.orgs);

// Or, you can use the `Promise` API.
getBookingPageData(getBookingPageDataVars).then((response) => {
  const data = response.data;
  console.log(data.orgs);
});
```

### Using `GetBookingPageData`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getBookingPageDataRef, GetBookingPageDataVariables } from '@bridgeway/database';

// The `GetBookingPageData` query requires an argument of type `GetBookingPageDataVariables`:
const getBookingPageDataVars: GetBookingPageDataVariables = {
  slug: ..., 
};

// Call the `getBookingPageDataRef()` function to get a reference to the query.
const ref = getBookingPageDataRef(getBookingPageDataVars);
// Variables can be defined inline as well.
const ref = getBookingPageDataRef({ slug: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getBookingPageDataRef(dataConnect, getBookingPageDataVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.orgs);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.orgs);
});
```

## GetAppointmentsForDay
You can execute the `GetAppointmentsForDay` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
getAppointmentsForDay(vars: GetAppointmentsForDayVariables, options?: ExecuteQueryOptions): QueryPromise<GetAppointmentsForDayData, GetAppointmentsForDayVariables>;

interface GetAppointmentsForDayRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetAppointmentsForDayVariables): QueryRef<GetAppointmentsForDayData, GetAppointmentsForDayVariables>;
}
export const getAppointmentsForDayRef: GetAppointmentsForDayRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getAppointmentsForDay(dc: DataConnect, vars: GetAppointmentsForDayVariables, options?: ExecuteQueryOptions): QueryPromise<GetAppointmentsForDayData, GetAppointmentsForDayVariables>;

interface GetAppointmentsForDayRef {
  ...
  (dc: DataConnect, vars: GetAppointmentsForDayVariables): QueryRef<GetAppointmentsForDayData, GetAppointmentsForDayVariables>;
}
export const getAppointmentsForDayRef: GetAppointmentsForDayRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getAppointmentsForDayRef:
```typescript
const name = getAppointmentsForDayRef.operationName;
console.log(name);
```

### Variables
The `GetAppointmentsForDay` query requires an argument of type `GetAppointmentsForDayVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetAppointmentsForDayVariables {
  orgId: UUIDString;
  startOfDay: TimestampString;
  endOfDay: TimestampString;
}
```
### Return Type
Recall that executing the `GetAppointmentsForDay` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetAppointmentsForDayData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetAppointmentsForDayData {
  appointments: ({
    scheduledAt: TimestampString;
    service?: {
      durationMinutes?: number | null;
    };
  })[];
}
```
### Using `GetAppointmentsForDay`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getAppointmentsForDay, GetAppointmentsForDayVariables } from '@bridgeway/database';

// The `GetAppointmentsForDay` query requires an argument of type `GetAppointmentsForDayVariables`:
const getAppointmentsForDayVars: GetAppointmentsForDayVariables = {
  orgId: ..., 
  startOfDay: ..., 
  endOfDay: ..., 
};

// Call the `getAppointmentsForDay()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getAppointmentsForDay(getAppointmentsForDayVars);
// Variables can be defined inline as well.
const { data } = await getAppointmentsForDay({ orgId: ..., startOfDay: ..., endOfDay: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getAppointmentsForDay(dataConnect, getAppointmentsForDayVars);

console.log(data.appointments);

// Or, you can use the `Promise` API.
getAppointmentsForDay(getAppointmentsForDayVars).then((response) => {
  const data = response.data;
  console.log(data.appointments);
});
```

### Using `GetAppointmentsForDay`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getAppointmentsForDayRef, GetAppointmentsForDayVariables } from '@bridgeway/database';

// The `GetAppointmentsForDay` query requires an argument of type `GetAppointmentsForDayVariables`:
const getAppointmentsForDayVars: GetAppointmentsForDayVariables = {
  orgId: ..., 
  startOfDay: ..., 
  endOfDay: ..., 
};

// Call the `getAppointmentsForDayRef()` function to get a reference to the query.
const ref = getAppointmentsForDayRef(getAppointmentsForDayVars);
// Variables can be defined inline as well.
const ref = getAppointmentsForDayRef({ orgId: ..., startOfDay: ..., endOfDay: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getAppointmentsForDayRef(dataConnect, getAppointmentsForDayVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.appointments);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.appointments);
});
```

## GetBookingById
You can execute the `GetBookingById` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
getBookingById(vars: GetBookingByIdVariables, options?: ExecuteQueryOptions): QueryPromise<GetBookingByIdData, GetBookingByIdVariables>;

interface GetBookingByIdRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetBookingByIdVariables): QueryRef<GetBookingByIdData, GetBookingByIdVariables>;
}
export const getBookingByIdRef: GetBookingByIdRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getBookingById(dc: DataConnect, vars: GetBookingByIdVariables, options?: ExecuteQueryOptions): QueryPromise<GetBookingByIdData, GetBookingByIdVariables>;

interface GetBookingByIdRef {
  ...
  (dc: DataConnect, vars: GetBookingByIdVariables): QueryRef<GetBookingByIdData, GetBookingByIdVariables>;
}
export const getBookingByIdRef: GetBookingByIdRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getBookingByIdRef:
```typescript
const name = getBookingByIdRef.operationName;
console.log(name);
```

### Variables
The `GetBookingById` query requires an argument of type `GetBookingByIdVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetBookingByIdVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `GetBookingById` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetBookingByIdData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetBookingByIdData {
  booking?: {
    id: UUIDString;
    status: string;
    paymentStatus?: string | null;
    service?: {
      id: UUIDString;
      name: string;
      price?: number | null;
    } & Service_Key;
  } & Booking_Key;
}
```
### Using `GetBookingById`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getBookingById, GetBookingByIdVariables } from '@bridgeway/database';

// The `GetBookingById` query requires an argument of type `GetBookingByIdVariables`:
const getBookingByIdVars: GetBookingByIdVariables = {
  id: ..., 
};

// Call the `getBookingById()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getBookingById(getBookingByIdVars);
// Variables can be defined inline as well.
const { data } = await getBookingById({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getBookingById(dataConnect, getBookingByIdVars);

console.log(data.booking);

// Or, you can use the `Promise` API.
getBookingById(getBookingByIdVars).then((response) => {
  const data = response.data;
  console.log(data.booking);
});
```

### Using `GetBookingById`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getBookingByIdRef, GetBookingByIdVariables } from '@bridgeway/database';

// The `GetBookingById` query requires an argument of type `GetBookingByIdVariables`:
const getBookingByIdVars: GetBookingByIdVariables = {
  id: ..., 
};

// Call the `getBookingByIdRef()` function to get a reference to the query.
const ref = getBookingByIdRef(getBookingByIdVars);
// Variables can be defined inline as well.
const ref = getBookingByIdRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getBookingByIdRef(dataConnect, getBookingByIdVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.booking);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.booking);
});
```

## GetUpcomingBookings
You can execute the `GetUpcomingBookings` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
getUpcomingBookings(vars: GetUpcomingBookingsVariables, options?: ExecuteQueryOptions): QueryPromise<GetUpcomingBookingsData, GetUpcomingBookingsVariables>;

interface GetUpcomingBookingsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetUpcomingBookingsVariables): QueryRef<GetUpcomingBookingsData, GetUpcomingBookingsVariables>;
}
export const getUpcomingBookingsRef: GetUpcomingBookingsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getUpcomingBookings(dc: DataConnect, vars: GetUpcomingBookingsVariables, options?: ExecuteQueryOptions): QueryPromise<GetUpcomingBookingsData, GetUpcomingBookingsVariables>;

interface GetUpcomingBookingsRef {
  ...
  (dc: DataConnect, vars: GetUpcomingBookingsVariables): QueryRef<GetUpcomingBookingsData, GetUpcomingBookingsVariables>;
}
export const getUpcomingBookingsRef: GetUpcomingBookingsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getUpcomingBookingsRef:
```typescript
const name = getUpcomingBookingsRef.operationName;
console.log(name);
```

### Variables
The `GetUpcomingBookings` query requires an argument of type `GetUpcomingBookingsVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetUpcomingBookingsVariables {
  status: string;
  windowLo: DateString;
  windowHi: DateString;
  check24h?: boolean | null;
  check2h?: boolean | null;
}
```
### Return Type
Recall that executing the `GetUpcomingBookings` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetUpcomingBookingsData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetUpcomingBookingsData {
  bookings: ({
    id: UUIDString;
    orgId: UUIDString;
    name: string;
    email?: string | null;
    phone?: string | null;
    preferredDate?: DateString | null;
    preferredTime?: string | null;
    reminder24hSent?: boolean | null;
    reminder2hSent?: boolean | null;
    service?: {
      name: string;
    };
  } & Booking_Key)[];
}
```
### Using `GetUpcomingBookings`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getUpcomingBookings, GetUpcomingBookingsVariables } from '@bridgeway/database';

// The `GetUpcomingBookings` query requires an argument of type `GetUpcomingBookingsVariables`:
const getUpcomingBookingsVars: GetUpcomingBookingsVariables = {
  status: ..., 
  windowLo: ..., 
  windowHi: ..., 
  check24h: ..., // optional
  check2h: ..., // optional
};

// Call the `getUpcomingBookings()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getUpcomingBookings(getUpcomingBookingsVars);
// Variables can be defined inline as well.
const { data } = await getUpcomingBookings({ status: ..., windowLo: ..., windowHi: ..., check24h: ..., check2h: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getUpcomingBookings(dataConnect, getUpcomingBookingsVars);

console.log(data.bookings);

// Or, you can use the `Promise` API.
getUpcomingBookings(getUpcomingBookingsVars).then((response) => {
  const data = response.data;
  console.log(data.bookings);
});
```

### Using `GetUpcomingBookings`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getUpcomingBookingsRef, GetUpcomingBookingsVariables } from '@bridgeway/database';

// The `GetUpcomingBookings` query requires an argument of type `GetUpcomingBookingsVariables`:
const getUpcomingBookingsVars: GetUpcomingBookingsVariables = {
  status: ..., 
  windowLo: ..., 
  windowHi: ..., 
  check24h: ..., // optional
  check2h: ..., // optional
};

// Call the `getUpcomingBookingsRef()` function to get a reference to the query.
const ref = getUpcomingBookingsRef(getUpcomingBookingsVars);
// Variables can be defined inline as well.
const ref = getUpcomingBookingsRef({ status: ..., windowLo: ..., windowHi: ..., check24h: ..., check2h: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getUpcomingBookingsRef(dataConnect, getUpcomingBookingsVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.bookings);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.bookings);
});
```

## GetClientByEmail
You can execute the `GetClientByEmail` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
getClientByEmail(vars: GetClientByEmailVariables, options?: ExecuteQueryOptions): QueryPromise<GetClientByEmailData, GetClientByEmailVariables>;

interface GetClientByEmailRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetClientByEmailVariables): QueryRef<GetClientByEmailData, GetClientByEmailVariables>;
}
export const getClientByEmailRef: GetClientByEmailRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getClientByEmail(dc: DataConnect, vars: GetClientByEmailVariables, options?: ExecuteQueryOptions): QueryPromise<GetClientByEmailData, GetClientByEmailVariables>;

interface GetClientByEmailRef {
  ...
  (dc: DataConnect, vars: GetClientByEmailVariables): QueryRef<GetClientByEmailData, GetClientByEmailVariables>;
}
export const getClientByEmailRef: GetClientByEmailRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getClientByEmailRef:
```typescript
const name = getClientByEmailRef.operationName;
console.log(name);
```

### Variables
The `GetClientByEmail` query requires an argument of type `GetClientByEmailVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetClientByEmailVariables {
  orgId: UUIDString;
  email: string;
}
```
### Return Type
Recall that executing the `GetClientByEmail` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetClientByEmailData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetClientByEmailData {
  clients: ({
    id: UUIDString;
    name: string;
    email?: string | null;
    phone?: string | null;
  } & Client_Key)[];
}
```
### Using `GetClientByEmail`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getClientByEmail, GetClientByEmailVariables } from '@bridgeway/database';

// The `GetClientByEmail` query requires an argument of type `GetClientByEmailVariables`:
const getClientByEmailVars: GetClientByEmailVariables = {
  orgId: ..., 
  email: ..., 
};

// Call the `getClientByEmail()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getClientByEmail(getClientByEmailVars);
// Variables can be defined inline as well.
const { data } = await getClientByEmail({ orgId: ..., email: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getClientByEmail(dataConnect, getClientByEmailVars);

console.log(data.clients);

// Or, you can use the `Promise` API.
getClientByEmail(getClientByEmailVars).then((response) => {
  const data = response.data;
  console.log(data.clients);
});
```

### Using `GetClientByEmail`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getClientByEmailRef, GetClientByEmailVariables } from '@bridgeway/database';

// The `GetClientByEmail` query requires an argument of type `GetClientByEmailVariables`:
const getClientByEmailVars: GetClientByEmailVariables = {
  orgId: ..., 
  email: ..., 
};

// Call the `getClientByEmailRef()` function to get a reference to the query.
const ref = getClientByEmailRef(getClientByEmailVars);
// Variables can be defined inline as well.
const ref = getClientByEmailRef({ orgId: ..., email: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getClientByEmailRef(dataConnect, getClientByEmailVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.clients);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.clients);
});
```

## GetClientByPhone
You can execute the `GetClientByPhone` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
getClientByPhone(vars: GetClientByPhoneVariables, options?: ExecuteQueryOptions): QueryPromise<GetClientByPhoneData, GetClientByPhoneVariables>;

interface GetClientByPhoneRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetClientByPhoneVariables): QueryRef<GetClientByPhoneData, GetClientByPhoneVariables>;
}
export const getClientByPhoneRef: GetClientByPhoneRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getClientByPhone(dc: DataConnect, vars: GetClientByPhoneVariables, options?: ExecuteQueryOptions): QueryPromise<GetClientByPhoneData, GetClientByPhoneVariables>;

interface GetClientByPhoneRef {
  ...
  (dc: DataConnect, vars: GetClientByPhoneVariables): QueryRef<GetClientByPhoneData, GetClientByPhoneVariables>;
}
export const getClientByPhoneRef: GetClientByPhoneRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getClientByPhoneRef:
```typescript
const name = getClientByPhoneRef.operationName;
console.log(name);
```

### Variables
The `GetClientByPhone` query requires an argument of type `GetClientByPhoneVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetClientByPhoneVariables {
  orgId: UUIDString;
  phone: string;
}
```
### Return Type
Recall that executing the `GetClientByPhone` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetClientByPhoneData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetClientByPhoneData {
  clients: ({
    id: UUIDString;
    name: string;
    email?: string | null;
    phone?: string | null;
  } & Client_Key)[];
}
```
### Using `GetClientByPhone`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getClientByPhone, GetClientByPhoneVariables } from '@bridgeway/database';

// The `GetClientByPhone` query requires an argument of type `GetClientByPhoneVariables`:
const getClientByPhoneVars: GetClientByPhoneVariables = {
  orgId: ..., 
  phone: ..., 
};

// Call the `getClientByPhone()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getClientByPhone(getClientByPhoneVars);
// Variables can be defined inline as well.
const { data } = await getClientByPhone({ orgId: ..., phone: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getClientByPhone(dataConnect, getClientByPhoneVars);

console.log(data.clients);

// Or, you can use the `Promise` API.
getClientByPhone(getClientByPhoneVars).then((response) => {
  const data = response.data;
  console.log(data.clients);
});
```

### Using `GetClientByPhone`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getClientByPhoneRef, GetClientByPhoneVariables } from '@bridgeway/database';

// The `GetClientByPhone` query requires an argument of type `GetClientByPhoneVariables`:
const getClientByPhoneVars: GetClientByPhoneVariables = {
  orgId: ..., 
  phone: ..., 
};

// Call the `getClientByPhoneRef()` function to get a reference to the query.
const ref = getClientByPhoneRef(getClientByPhoneVars);
// Variables can be defined inline as well.
const ref = getClientByPhoneRef({ orgId: ..., phone: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getClientByPhoneRef(dataConnect, getClientByPhoneVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.clients);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.clients);
});
```

## GetClientAppointments
You can execute the `GetClientAppointments` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
getClientAppointments(vars: GetClientAppointmentsVariables, options?: ExecuteQueryOptions): QueryPromise<GetClientAppointmentsData, GetClientAppointmentsVariables>;

interface GetClientAppointmentsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetClientAppointmentsVariables): QueryRef<GetClientAppointmentsData, GetClientAppointmentsVariables>;
}
export const getClientAppointmentsRef: GetClientAppointmentsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getClientAppointments(dc: DataConnect, vars: GetClientAppointmentsVariables, options?: ExecuteQueryOptions): QueryPromise<GetClientAppointmentsData, GetClientAppointmentsVariables>;

interface GetClientAppointmentsRef {
  ...
  (dc: DataConnect, vars: GetClientAppointmentsVariables): QueryRef<GetClientAppointmentsData, GetClientAppointmentsVariables>;
}
export const getClientAppointmentsRef: GetClientAppointmentsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getClientAppointmentsRef:
```typescript
const name = getClientAppointmentsRef.operationName;
console.log(name);
```

### Variables
The `GetClientAppointments` query requires an argument of type `GetClientAppointmentsVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetClientAppointmentsVariables {
  clientId: UUIDString;
}
```
### Return Type
Recall that executing the `GetClientAppointments` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetClientAppointmentsData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetClientAppointmentsData {
  appointments: ({
    id: UUIDString;
    scheduledAt: TimestampString;
    durationMinutes?: number | null;
    status: string;
    amount?: number | null;
    notes?: string | null;
    service?: {
      name: string;
    };
  } & Appointment_Key)[];
}
```
### Using `GetClientAppointments`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getClientAppointments, GetClientAppointmentsVariables } from '@bridgeway/database';

// The `GetClientAppointments` query requires an argument of type `GetClientAppointmentsVariables`:
const getClientAppointmentsVars: GetClientAppointmentsVariables = {
  clientId: ..., 
};

// Call the `getClientAppointments()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getClientAppointments(getClientAppointmentsVars);
// Variables can be defined inline as well.
const { data } = await getClientAppointments({ clientId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getClientAppointments(dataConnect, getClientAppointmentsVars);

console.log(data.appointments);

// Or, you can use the `Promise` API.
getClientAppointments(getClientAppointmentsVars).then((response) => {
  const data = response.data;
  console.log(data.appointments);
});
```

### Using `GetClientAppointments`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getClientAppointmentsRef, GetClientAppointmentsVariables } from '@bridgeway/database';

// The `GetClientAppointments` query requires an argument of type `GetClientAppointmentsVariables`:
const getClientAppointmentsVars: GetClientAppointmentsVariables = {
  clientId: ..., 
};

// Call the `getClientAppointmentsRef()` function to get a reference to the query.
const ref = getClientAppointmentsRef(getClientAppointmentsVars);
// Variables can be defined inline as well.
const ref = getClientAppointmentsRef({ clientId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getClientAppointmentsRef(dataConnect, getClientAppointmentsVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.appointments);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.appointments);
});
```

## GetOrgAppointments
You can execute the `GetOrgAppointments` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
getOrgAppointments(vars: GetOrgAppointmentsVariables, options?: ExecuteQueryOptions): QueryPromise<GetOrgAppointmentsData, GetOrgAppointmentsVariables>;

interface GetOrgAppointmentsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetOrgAppointmentsVariables): QueryRef<GetOrgAppointmentsData, GetOrgAppointmentsVariables>;
}
export const getOrgAppointmentsRef: GetOrgAppointmentsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getOrgAppointments(dc: DataConnect, vars: GetOrgAppointmentsVariables, options?: ExecuteQueryOptions): QueryPromise<GetOrgAppointmentsData, GetOrgAppointmentsVariables>;

interface GetOrgAppointmentsRef {
  ...
  (dc: DataConnect, vars: GetOrgAppointmentsVariables): QueryRef<GetOrgAppointmentsData, GetOrgAppointmentsVariables>;
}
export const getOrgAppointmentsRef: GetOrgAppointmentsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getOrgAppointmentsRef:
```typescript
const name = getOrgAppointmentsRef.operationName;
console.log(name);
```

### Variables
The `GetOrgAppointments` query requires an argument of type `GetOrgAppointmentsVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetOrgAppointmentsVariables {
  orgId: UUIDString;
}
```
### Return Type
Recall that executing the `GetOrgAppointments` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetOrgAppointmentsData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetOrgAppointmentsData {
  appointments: ({
    id: UUIDString;
    scheduledAt: TimestampString;
    status: string;
    amount?: number | null;
    notes?: string | null;
    durationMinutes?: number | null;
    client?: {
      id: UUIDString;
      name: string;
    } & Client_Key;
    service?: {
      name: string;
    };
  } & Appointment_Key)[];
}
```
### Using `GetOrgAppointments`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getOrgAppointments, GetOrgAppointmentsVariables } from '@bridgeway/database';

// The `GetOrgAppointments` query requires an argument of type `GetOrgAppointmentsVariables`:
const getOrgAppointmentsVars: GetOrgAppointmentsVariables = {
  orgId: ..., 
};

// Call the `getOrgAppointments()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getOrgAppointments(getOrgAppointmentsVars);
// Variables can be defined inline as well.
const { data } = await getOrgAppointments({ orgId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getOrgAppointments(dataConnect, getOrgAppointmentsVars);

console.log(data.appointments);

// Or, you can use the `Promise` API.
getOrgAppointments(getOrgAppointmentsVars).then((response) => {
  const data = response.data;
  console.log(data.appointments);
});
```

### Using `GetOrgAppointments`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getOrgAppointmentsRef, GetOrgAppointmentsVariables } from '@bridgeway/database';

// The `GetOrgAppointments` query requires an argument of type `GetOrgAppointmentsVariables`:
const getOrgAppointmentsVars: GetOrgAppointmentsVariables = {
  orgId: ..., 
};

// Call the `getOrgAppointmentsRef()` function to get a reference to the query.
const ref = getOrgAppointmentsRef(getOrgAppointmentsVars);
// Variables can be defined inline as well.
const ref = getOrgAppointmentsRef({ orgId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getOrgAppointmentsRef(dataConnect, getOrgAppointmentsVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.appointments);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.appointments);
});
```

## GetActiveServices
You can execute the `GetActiveServices` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
getActiveServices(vars: GetActiveServicesVariables, options?: ExecuteQueryOptions): QueryPromise<GetActiveServicesData, GetActiveServicesVariables>;

interface GetActiveServicesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetActiveServicesVariables): QueryRef<GetActiveServicesData, GetActiveServicesVariables>;
}
export const getActiveServicesRef: GetActiveServicesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getActiveServices(dc: DataConnect, vars: GetActiveServicesVariables, options?: ExecuteQueryOptions): QueryPromise<GetActiveServicesData, GetActiveServicesVariables>;

interface GetActiveServicesRef {
  ...
  (dc: DataConnect, vars: GetActiveServicesVariables): QueryRef<GetActiveServicesData, GetActiveServicesVariables>;
}
export const getActiveServicesRef: GetActiveServicesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getActiveServicesRef:
```typescript
const name = getActiveServicesRef.operationName;
console.log(name);
```

### Variables
The `GetActiveServices` query requires an argument of type `GetActiveServicesVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetActiveServicesVariables {
  orgId: UUIDString;
}
```
### Return Type
Recall that executing the `GetActiveServices` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetActiveServicesData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetActiveServicesData {
  services: ({
    id: UUIDString;
    name: string;
    price?: number | null;
    durationMinutes?: number | null;
  } & Service_Key)[];
}
```
### Using `GetActiveServices`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getActiveServices, GetActiveServicesVariables } from '@bridgeway/database';

// The `GetActiveServices` query requires an argument of type `GetActiveServicesVariables`:
const getActiveServicesVars: GetActiveServicesVariables = {
  orgId: ..., 
};

// Call the `getActiveServices()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getActiveServices(getActiveServicesVars);
// Variables can be defined inline as well.
const { data } = await getActiveServices({ orgId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getActiveServices(dataConnect, getActiveServicesVars);

console.log(data.services);

// Or, you can use the `Promise` API.
getActiveServices(getActiveServicesVars).then((response) => {
  const data = response.data;
  console.log(data.services);
});
```

### Using `GetActiveServices`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getActiveServicesRef, GetActiveServicesVariables } from '@bridgeway/database';

// The `GetActiveServices` query requires an argument of type `GetActiveServicesVariables`:
const getActiveServicesVars: GetActiveServicesVariables = {
  orgId: ..., 
};

// Call the `getActiveServicesRef()` function to get a reference to the query.
const ref = getActiveServicesRef(getActiveServicesVars);
// Variables can be defined inline as well.
const ref = getActiveServicesRef({ orgId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getActiveServicesRef(dataConnect, getActiveServicesVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.services);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.services);
});
```

## SearchClients
You can execute the `SearchClients` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
searchClients(vars: SearchClientsVariables, options?: ExecuteQueryOptions): QueryPromise<SearchClientsData, SearchClientsVariables>;

interface SearchClientsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: SearchClientsVariables): QueryRef<SearchClientsData, SearchClientsVariables>;
}
export const searchClientsRef: SearchClientsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
searchClients(dc: DataConnect, vars: SearchClientsVariables, options?: ExecuteQueryOptions): QueryPromise<SearchClientsData, SearchClientsVariables>;

interface SearchClientsRef {
  ...
  (dc: DataConnect, vars: SearchClientsVariables): QueryRef<SearchClientsData, SearchClientsVariables>;
}
export const searchClientsRef: SearchClientsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the searchClientsRef:
```typescript
const name = searchClientsRef.operationName;
console.log(name);
```

### Variables
The `SearchClients` query requires an argument of type `SearchClientsVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface SearchClientsVariables {
  orgId: UUIDString;
  query: string;
}
```
### Return Type
Recall that executing the `SearchClients` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `SearchClientsData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface SearchClientsData {
  clients: ({
    id: UUIDString;
    name: string;
    email?: string | null;
  } & Client_Key)[];
}
```
### Using `SearchClients`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, searchClients, SearchClientsVariables } from '@bridgeway/database';

// The `SearchClients` query requires an argument of type `SearchClientsVariables`:
const searchClientsVars: SearchClientsVariables = {
  orgId: ..., 
  query: ..., 
};

// Call the `searchClients()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await searchClients(searchClientsVars);
// Variables can be defined inline as well.
const { data } = await searchClients({ orgId: ..., query: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await searchClients(dataConnect, searchClientsVars);

console.log(data.clients);

// Or, you can use the `Promise` API.
searchClients(searchClientsVars).then((response) => {
  const data = response.data;
  console.log(data.clients);
});
```

### Using `SearchClients`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, searchClientsRef, SearchClientsVariables } from '@bridgeway/database';

// The `SearchClients` query requires an argument of type `SearchClientsVariables`:
const searchClientsVars: SearchClientsVariables = {
  orgId: ..., 
  query: ..., 
};

// Call the `searchClientsRef()` function to get a reference to the query.
const ref = searchClientsRef(searchClientsVars);
// Variables can be defined inline as well.
const ref = searchClientsRef({ orgId: ..., query: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = searchClientsRef(dataConnect, searchClientsVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.clients);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.clients);
});
```

## GetOrgClients
You can execute the `GetOrgClients` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
getOrgClients(vars: GetOrgClientsVariables, options?: ExecuteQueryOptions): QueryPromise<GetOrgClientsData, GetOrgClientsVariables>;

interface GetOrgClientsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetOrgClientsVariables): QueryRef<GetOrgClientsData, GetOrgClientsVariables>;
}
export const getOrgClientsRef: GetOrgClientsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getOrgClients(dc: DataConnect, vars: GetOrgClientsVariables, options?: ExecuteQueryOptions): QueryPromise<GetOrgClientsData, GetOrgClientsVariables>;

interface GetOrgClientsRef {
  ...
  (dc: DataConnect, vars: GetOrgClientsVariables): QueryRef<GetOrgClientsData, GetOrgClientsVariables>;
}
export const getOrgClientsRef: GetOrgClientsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getOrgClientsRef:
```typescript
const name = getOrgClientsRef.operationName;
console.log(name);
```

### Variables
The `GetOrgClients` query requires an argument of type `GetOrgClientsVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetOrgClientsVariables {
  orgId: UUIDString;
}
```
### Return Type
Recall that executing the `GetOrgClients` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetOrgClientsData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetOrgClientsData {
  clients: ({
    id: UUIDString;
    name: string;
    email?: string | null;
    phone?: string | null;
    createdAt: TimestampString;
    appointments_on_client: ({
      id: UUIDString;
      scheduledAt: TimestampString;
      amount?: number | null;
      status: string;
    } & Appointment_Key)[];
  } & Client_Key)[];
}
```
### Using `GetOrgClients`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getOrgClients, GetOrgClientsVariables } from '@bridgeway/database';

// The `GetOrgClients` query requires an argument of type `GetOrgClientsVariables`:
const getOrgClientsVars: GetOrgClientsVariables = {
  orgId: ..., 
};

// Call the `getOrgClients()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getOrgClients(getOrgClientsVars);
// Variables can be defined inline as well.
const { data } = await getOrgClients({ orgId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getOrgClients(dataConnect, getOrgClientsVars);

console.log(data.clients);

// Or, you can use the `Promise` API.
getOrgClients(getOrgClientsVars).then((response) => {
  const data = response.data;
  console.log(data.clients);
});
```

### Using `GetOrgClients`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getOrgClientsRef, GetOrgClientsVariables } from '@bridgeway/database';

// The `GetOrgClients` query requires an argument of type `GetOrgClientsVariables`:
const getOrgClientsVars: GetOrgClientsVariables = {
  orgId: ..., 
};

// Call the `getOrgClientsRef()` function to get a reference to the query.
const ref = getOrgClientsRef(getOrgClientsVars);
// Variables can be defined inline as well.
const ref = getOrgClientsRef({ orgId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getOrgClientsRef(dataConnect, getOrgClientsVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.clients);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.clients);
});
```

## GetClientDetail
You can execute the `GetClientDetail` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
getClientDetail(vars: GetClientDetailVariables, options?: ExecuteQueryOptions): QueryPromise<GetClientDetailData, GetClientDetailVariables>;

interface GetClientDetailRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetClientDetailVariables): QueryRef<GetClientDetailData, GetClientDetailVariables>;
}
export const getClientDetailRef: GetClientDetailRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getClientDetail(dc: DataConnect, vars: GetClientDetailVariables, options?: ExecuteQueryOptions): QueryPromise<GetClientDetailData, GetClientDetailVariables>;

interface GetClientDetailRef {
  ...
  (dc: DataConnect, vars: GetClientDetailVariables): QueryRef<GetClientDetailData, GetClientDetailVariables>;
}
export const getClientDetailRef: GetClientDetailRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getClientDetailRef:
```typescript
const name = getClientDetailRef.operationName;
console.log(name);
```

### Variables
The `GetClientDetail` query requires an argument of type `GetClientDetailVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetClientDetailVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `GetClientDetail` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetClientDetailData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetClientDetailData {
  client?: {
    id: UUIDString;
    name: string;
    email?: string | null;
    phone?: string | null;
    dateOfBirth?: DateString | null;
    address?: string | null;
    notes?: string | null;
    createdAt: TimestampString;
    appointments_on_client: ({
      id: UUIDString;
      scheduledAt: TimestampString;
      durationMinutes?: number | null;
      status: string;
      amount?: number | null;
      notes?: string | null;
      service?: {
        name: string;
      };
    } & Appointment_Key)[];
    clientPackages_on_client: ({
      id: UUIDString;
      name: string;
      totalSessions: number;
      usedSessions: number;
      price?: number | null;
      purchasedAt: TimestampString;
      expiresAt?: TimestampString | null;
      status: string;
    } & ClientPackage_Key)[];
    classRegistrations_on_client: ({
      id: UUIDString;
      classDate: DateString;
      status: string;
      classEntity: {
        name: string;
        startTime: string;
        durationMinutes?: number | null;
      };
    } & ClassRegistration_Key)[];
  } & Client_Key;
}
```
### Using `GetClientDetail`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getClientDetail, GetClientDetailVariables } from '@bridgeway/database';

// The `GetClientDetail` query requires an argument of type `GetClientDetailVariables`:
const getClientDetailVars: GetClientDetailVariables = {
  id: ..., 
};

// Call the `getClientDetail()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getClientDetail(getClientDetailVars);
// Variables can be defined inline as well.
const { data } = await getClientDetail({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getClientDetail(dataConnect, getClientDetailVars);

console.log(data.client);

// Or, you can use the `Promise` API.
getClientDetail(getClientDetailVars).then((response) => {
  const data = response.data;
  console.log(data.client);
});
```

### Using `GetClientDetail`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getClientDetailRef, GetClientDetailVariables } from '@bridgeway/database';

// The `GetClientDetail` query requires an argument of type `GetClientDetailVariables`:
const getClientDetailVars: GetClientDetailVariables = {
  id: ..., 
};

// Call the `getClientDetailRef()` function to get a reference to the query.
const ref = getClientDetailRef(getClientDetailVars);
// Variables can be defined inline as well.
const ref = getClientDetailRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getClientDetailRef(dataConnect, getClientDetailVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.client);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.client);
});
```

## GetOrgQueue
You can execute the `GetOrgQueue` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
getOrgQueue(vars: GetOrgQueueVariables, options?: ExecuteQueryOptions): QueryPromise<GetOrgQueueData, GetOrgQueueVariables>;

interface GetOrgQueueRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetOrgQueueVariables): QueryRef<GetOrgQueueData, GetOrgQueueVariables>;
}
export const getOrgQueueRef: GetOrgQueueRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getOrgQueue(dc: DataConnect, vars: GetOrgQueueVariables, options?: ExecuteQueryOptions): QueryPromise<GetOrgQueueData, GetOrgQueueVariables>;

interface GetOrgQueueRef {
  ...
  (dc: DataConnect, vars: GetOrgQueueVariables): QueryRef<GetOrgQueueData, GetOrgQueueVariables>;
}
export const getOrgQueueRef: GetOrgQueueRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getOrgQueueRef:
```typescript
const name = getOrgQueueRef.operationName;
console.log(name);
```

### Variables
The `GetOrgQueue` query requires an argument of type `GetOrgQueueVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetOrgQueueVariables {
  orgId: UUIDString;
}
```
### Return Type
Recall that executing the `GetOrgQueue` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetOrgQueueData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetOrgQueueData {
  queueEntries: ({
    id: UUIDString;
    clientName: string;
    status: string;
    position: number;
    notes?: string | null;
    joinedAt: TimestampString;
    calledAt?: TimestampString | null;
    completedAt?: TimestampString | null;
    client?: {
      id: UUIDString;
      name: string;
    } & Client_Key;
    service?: {
      id: UUIDString;
      name: string;
    } & Service_Key;
    staff?: {
      id: UUIDString;
      fullName?: string | null;
    } & Profile_Key;
  } & QueueEntry_Key)[];
}
```
### Using `GetOrgQueue`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getOrgQueue, GetOrgQueueVariables } from '@bridgeway/database';

// The `GetOrgQueue` query requires an argument of type `GetOrgQueueVariables`:
const getOrgQueueVars: GetOrgQueueVariables = {
  orgId: ..., 
};

// Call the `getOrgQueue()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getOrgQueue(getOrgQueueVars);
// Variables can be defined inline as well.
const { data } = await getOrgQueue({ orgId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getOrgQueue(dataConnect, getOrgQueueVars);

console.log(data.queueEntries);

// Or, you can use the `Promise` API.
getOrgQueue(getOrgQueueVars).then((response) => {
  const data = response.data;
  console.log(data.queueEntries);
});
```

### Using `GetOrgQueue`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getOrgQueueRef, GetOrgQueueVariables } from '@bridgeway/database';

// The `GetOrgQueue` query requires an argument of type `GetOrgQueueVariables`:
const getOrgQueueVars: GetOrgQueueVariables = {
  orgId: ..., 
};

// Call the `getOrgQueueRef()` function to get a reference to the query.
const ref = getOrgQueueRef(getOrgQueueVars);
// Variables can be defined inline as well.
const ref = getOrgQueueRef({ orgId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getOrgQueueRef(dataConnect, getOrgQueueVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.queueEntries);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.queueEntries);
});
```

## GetUpcomingOrgAppointments
You can execute the `GetUpcomingOrgAppointments` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
getUpcomingOrgAppointments(vars: GetUpcomingOrgAppointmentsVariables, options?: ExecuteQueryOptions): QueryPromise<GetUpcomingOrgAppointmentsData, GetUpcomingOrgAppointmentsVariables>;

interface GetUpcomingOrgAppointmentsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetUpcomingOrgAppointmentsVariables): QueryRef<GetUpcomingOrgAppointmentsData, GetUpcomingOrgAppointmentsVariables>;
}
export const getUpcomingOrgAppointmentsRef: GetUpcomingOrgAppointmentsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getUpcomingOrgAppointments(dc: DataConnect, vars: GetUpcomingOrgAppointmentsVariables, options?: ExecuteQueryOptions): QueryPromise<GetUpcomingOrgAppointmentsData, GetUpcomingOrgAppointmentsVariables>;

interface GetUpcomingOrgAppointmentsRef {
  ...
  (dc: DataConnect, vars: GetUpcomingOrgAppointmentsVariables): QueryRef<GetUpcomingOrgAppointmentsData, GetUpcomingOrgAppointmentsVariables>;
}
export const getUpcomingOrgAppointmentsRef: GetUpcomingOrgAppointmentsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getUpcomingOrgAppointmentsRef:
```typescript
const name = getUpcomingOrgAppointmentsRef.operationName;
console.log(name);
```

### Variables
The `GetUpcomingOrgAppointments` query requires an argument of type `GetUpcomingOrgAppointmentsVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetUpcomingOrgAppointmentsVariables {
  orgId: UUIDString;
}
```
### Return Type
Recall that executing the `GetUpcomingOrgAppointments` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetUpcomingOrgAppointmentsData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetUpcomingOrgAppointmentsData {
  appointments: ({
    id: UUIDString;
    scheduledAt: TimestampString;
    durationMinutes?: number | null;
    status: string;
    amount?: number | null;
    client?: {
      id: UUIDString;
      name: string;
      email?: string | null;
      phone?: string | null;
    } & Client_Key;
    service?: {
      id: UUIDString;
      name: string;
    } & Service_Key;
  } & Appointment_Key)[];
}
```
### Using `GetUpcomingOrgAppointments`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getUpcomingOrgAppointments, GetUpcomingOrgAppointmentsVariables } from '@bridgeway/database';

// The `GetUpcomingOrgAppointments` query requires an argument of type `GetUpcomingOrgAppointmentsVariables`:
const getUpcomingOrgAppointmentsVars: GetUpcomingOrgAppointmentsVariables = {
  orgId: ..., 
};

// Call the `getUpcomingOrgAppointments()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getUpcomingOrgAppointments(getUpcomingOrgAppointmentsVars);
// Variables can be defined inline as well.
const { data } = await getUpcomingOrgAppointments({ orgId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getUpcomingOrgAppointments(dataConnect, getUpcomingOrgAppointmentsVars);

console.log(data.appointments);

// Or, you can use the `Promise` API.
getUpcomingOrgAppointments(getUpcomingOrgAppointmentsVars).then((response) => {
  const data = response.data;
  console.log(data.appointments);
});
```

### Using `GetUpcomingOrgAppointments`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getUpcomingOrgAppointmentsRef, GetUpcomingOrgAppointmentsVariables } from '@bridgeway/database';

// The `GetUpcomingOrgAppointments` query requires an argument of type `GetUpcomingOrgAppointmentsVariables`:
const getUpcomingOrgAppointmentsVars: GetUpcomingOrgAppointmentsVariables = {
  orgId: ..., 
};

// Call the `getUpcomingOrgAppointmentsRef()` function to get a reference to the query.
const ref = getUpcomingOrgAppointmentsRef(getUpcomingOrgAppointmentsVars);
// Variables can be defined inline as well.
const ref = getUpcomingOrgAppointmentsRef({ orgId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getUpcomingOrgAppointmentsRef(dataConnect, getUpcomingOrgAppointmentsVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.appointments);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.appointments);
});
```

## GetSlotsForDay
You can execute the `GetSlotsForDay` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
getSlotsForDay(vars: GetSlotsForDayVariables, options?: ExecuteQueryOptions): QueryPromise<GetSlotsForDayData, GetSlotsForDayVariables>;

interface GetSlotsForDayRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetSlotsForDayVariables): QueryRef<GetSlotsForDayData, GetSlotsForDayVariables>;
}
export const getSlotsForDayRef: GetSlotsForDayRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getSlotsForDay(dc: DataConnect, vars: GetSlotsForDayVariables, options?: ExecuteQueryOptions): QueryPromise<GetSlotsForDayData, GetSlotsForDayVariables>;

interface GetSlotsForDayRef {
  ...
  (dc: DataConnect, vars: GetSlotsForDayVariables): QueryRef<GetSlotsForDayData, GetSlotsForDayVariables>;
}
export const getSlotsForDayRef: GetSlotsForDayRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getSlotsForDayRef:
```typescript
const name = getSlotsForDayRef.operationName;
console.log(name);
```

### Variables
The `GetSlotsForDay` query requires an argument of type `GetSlotsForDayVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetSlotsForDayVariables {
  orgId: UUIDString;
  start: TimestampString;
  end: TimestampString;
}
```
### Return Type
Recall that executing the `GetSlotsForDay` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetSlotsForDayData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetSlotsForDayData {
  slots: ({
    id: UUIDString;
    startTime: TimestampString;
    endTime: TimestampString;
    status: string;
    staff?: {
      id: UUIDString;
      fullName?: string | null;
    } & Profile_Key;
  } & Slot_Key)[];
}
```
### Using `GetSlotsForDay`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getSlotsForDay, GetSlotsForDayVariables } from '@bridgeway/database';

// The `GetSlotsForDay` query requires an argument of type `GetSlotsForDayVariables`:
const getSlotsForDayVars: GetSlotsForDayVariables = {
  orgId: ..., 
  start: ..., 
  end: ..., 
};

// Call the `getSlotsForDay()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getSlotsForDay(getSlotsForDayVars);
// Variables can be defined inline as well.
const { data } = await getSlotsForDay({ orgId: ..., start: ..., end: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getSlotsForDay(dataConnect, getSlotsForDayVars);

console.log(data.slots);

// Or, you can use the `Promise` API.
getSlotsForDay(getSlotsForDayVars).then((response) => {
  const data = response.data;
  console.log(data.slots);
});
```

### Using `GetSlotsForDay`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getSlotsForDayRef, GetSlotsForDayVariables } from '@bridgeway/database';

// The `GetSlotsForDay` query requires an argument of type `GetSlotsForDayVariables`:
const getSlotsForDayVars: GetSlotsForDayVariables = {
  orgId: ..., 
  start: ..., 
  end: ..., 
};

// Call the `getSlotsForDayRef()` function to get a reference to the query.
const ref = getSlotsForDayRef(getSlotsForDayVars);
// Variables can be defined inline as well.
const ref = getSlotsForDayRef({ orgId: ..., start: ..., end: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getSlotsForDayRef(dataConnect, getSlotsForDayVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.slots);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.slots);
});
```

## GetActivePackageTemplates
You can execute the `GetActivePackageTemplates` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
getActivePackageTemplates(vars: GetActivePackageTemplatesVariables, options?: ExecuteQueryOptions): QueryPromise<GetActivePackageTemplatesData, GetActivePackageTemplatesVariables>;

interface GetActivePackageTemplatesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetActivePackageTemplatesVariables): QueryRef<GetActivePackageTemplatesData, GetActivePackageTemplatesVariables>;
}
export const getActivePackageTemplatesRef: GetActivePackageTemplatesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getActivePackageTemplates(dc: DataConnect, vars: GetActivePackageTemplatesVariables, options?: ExecuteQueryOptions): QueryPromise<GetActivePackageTemplatesData, GetActivePackageTemplatesVariables>;

interface GetActivePackageTemplatesRef {
  ...
  (dc: DataConnect, vars: GetActivePackageTemplatesVariables): QueryRef<GetActivePackageTemplatesData, GetActivePackageTemplatesVariables>;
}
export const getActivePackageTemplatesRef: GetActivePackageTemplatesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getActivePackageTemplatesRef:
```typescript
const name = getActivePackageTemplatesRef.operationName;
console.log(name);
```

### Variables
The `GetActivePackageTemplates` query requires an argument of type `GetActivePackageTemplatesVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetActivePackageTemplatesVariables {
  orgId: UUIDString;
}
```
### Return Type
Recall that executing the `GetActivePackageTemplates` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetActivePackageTemplatesData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetActivePackageTemplatesData {
  packageTemplates: ({
    id: UUIDString;
    name: string;
    sessionCount?: number | null;
    price: number;
    expiryDays?: number | null;
  } & PackageTemplate_Key)[];
}
```
### Using `GetActivePackageTemplates`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getActivePackageTemplates, GetActivePackageTemplatesVariables } from '@bridgeway/database';

// The `GetActivePackageTemplates` query requires an argument of type `GetActivePackageTemplatesVariables`:
const getActivePackageTemplatesVars: GetActivePackageTemplatesVariables = {
  orgId: ..., 
};

// Call the `getActivePackageTemplates()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getActivePackageTemplates(getActivePackageTemplatesVars);
// Variables can be defined inline as well.
const { data } = await getActivePackageTemplates({ orgId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getActivePackageTemplates(dataConnect, getActivePackageTemplatesVars);

console.log(data.packageTemplates);

// Or, you can use the `Promise` API.
getActivePackageTemplates(getActivePackageTemplatesVars).then((response) => {
  const data = response.data;
  console.log(data.packageTemplates);
});
```

### Using `GetActivePackageTemplates`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getActivePackageTemplatesRef, GetActivePackageTemplatesVariables } from '@bridgeway/database';

// The `GetActivePackageTemplates` query requires an argument of type `GetActivePackageTemplatesVariables`:
const getActivePackageTemplatesVars: GetActivePackageTemplatesVariables = {
  orgId: ..., 
};

// Call the `getActivePackageTemplatesRef()` function to get a reference to the query.
const ref = getActivePackageTemplatesRef(getActivePackageTemplatesVars);
// Variables can be defined inline as well.
const ref = getActivePackageTemplatesRef({ orgId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getActivePackageTemplatesRef(dataConnect, getActivePackageTemplatesVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.packageTemplates);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.packageTemplates);
});
```

## GetInAppNotifications
You can execute the `GetInAppNotifications` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
getInAppNotifications(vars: GetInAppNotificationsVariables, options?: ExecuteQueryOptions): QueryPromise<GetInAppNotificationsData, GetInAppNotificationsVariables>;

interface GetInAppNotificationsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetInAppNotificationsVariables): QueryRef<GetInAppNotificationsData, GetInAppNotificationsVariables>;
}
export const getInAppNotificationsRef: GetInAppNotificationsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getInAppNotifications(dc: DataConnect, vars: GetInAppNotificationsVariables, options?: ExecuteQueryOptions): QueryPromise<GetInAppNotificationsData, GetInAppNotificationsVariables>;

interface GetInAppNotificationsRef {
  ...
  (dc: DataConnect, vars: GetInAppNotificationsVariables): QueryRef<GetInAppNotificationsData, GetInAppNotificationsVariables>;
}
export const getInAppNotificationsRef: GetInAppNotificationsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getInAppNotificationsRef:
```typescript
const name = getInAppNotificationsRef.operationName;
console.log(name);
```

### Variables
The `GetInAppNotifications` query requires an argument of type `GetInAppNotificationsVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetInAppNotificationsVariables {
  orgId: UUIDString;
}
```
### Return Type
Recall that executing the `GetInAppNotifications` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetInAppNotificationsData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetInAppNotificationsData {
  inAppNotifications: ({
    id: UUIDString;
    type: string;
    title: string;
    message?: string | null;
    link?: string | null;
    isRead?: boolean | null;
    createdAt: TimestampString;
  } & InAppNotification_Key)[];
}
```
### Using `GetInAppNotifications`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getInAppNotifications, GetInAppNotificationsVariables } from '@bridgeway/database';

// The `GetInAppNotifications` query requires an argument of type `GetInAppNotificationsVariables`:
const getInAppNotificationsVars: GetInAppNotificationsVariables = {
  orgId: ..., 
};

// Call the `getInAppNotifications()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getInAppNotifications(getInAppNotificationsVars);
// Variables can be defined inline as well.
const { data } = await getInAppNotifications({ orgId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getInAppNotifications(dataConnect, getInAppNotificationsVars);

console.log(data.inAppNotifications);

// Or, you can use the `Promise` API.
getInAppNotifications(getInAppNotificationsVars).then((response) => {
  const data = response.data;
  console.log(data.inAppNotifications);
});
```

### Using `GetInAppNotifications`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getInAppNotificationsRef, GetInAppNotificationsVariables } from '@bridgeway/database';

// The `GetInAppNotifications` query requires an argument of type `GetInAppNotificationsVariables`:
const getInAppNotificationsVars: GetInAppNotificationsVariables = {
  orgId: ..., 
};

// Call the `getInAppNotificationsRef()` function to get a reference to the query.
const ref = getInAppNotificationsRef(getInAppNotificationsVars);
// Variables can be defined inline as well.
const ref = getInAppNotificationsRef({ orgId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getInAppNotificationsRef(dataConnect, getInAppNotificationsVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.inAppNotifications);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.inAppNotifications);
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
  allowPhotoUpload?: boolean | null;
  paymentRequired?: boolean | null;
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
  allowPhotoUpload: ..., // optional
  paymentRequired: ..., // optional
};

// Call the `updateOrgSettings()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateOrgSettings(updateOrgSettingsVars);
// Variables can be defined inline as well.
const { data } = await updateOrgSettings({ orgId: ..., disabledWidgets: ..., bookingConfig: ..., allowPhotoUpload: ..., paymentRequired: ..., });

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
  allowPhotoUpload: ..., // optional
  paymentRequired: ..., // optional
};

// Call the `updateOrgSettingsRef()` function to get a reference to the mutation.
const ref = updateOrgSettingsRef(updateOrgSettingsVars);
// Variables can be defined inline as well.
const ref = updateOrgSettingsRef({ orgId: ..., disabledWidgets: ..., bookingConfig: ..., allowPhotoUpload: ..., paymentRequired: ..., });

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

## CreateBooking
You can execute the `CreateBooking` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
createBooking(vars: CreateBookingVariables): MutationPromise<CreateBookingData, CreateBookingVariables>;

interface CreateBookingRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateBookingVariables): MutationRef<CreateBookingData, CreateBookingVariables>;
}
export const createBookingRef: CreateBookingRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createBooking(dc: DataConnect, vars: CreateBookingVariables): MutationPromise<CreateBookingData, CreateBookingVariables>;

interface CreateBookingRef {
  ...
  (dc: DataConnect, vars: CreateBookingVariables): MutationRef<CreateBookingData, CreateBookingVariables>;
}
export const createBookingRef: CreateBookingRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createBookingRef:
```typescript
const name = createBookingRef.operationName;
console.log(name);
```

### Variables
The `CreateBooking` mutation requires an argument of type `CreateBookingVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateBookingVariables {
  orgId: UUIDString;
  serviceId?: UUIDString | null;
  name: string;
  email?: string | null;
  phone?: string | null;
  preferredDate?: DateString | null;
  preferredTime?: string | null;
  notes?: string | null;
  status: string;
  paymentStatus?: string | null;
}
```
### Return Type
Recall that executing the `CreateBooking` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateBookingData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateBookingData {
  booking_insert: Booking_Key;
}
```
### Using `CreateBooking`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createBooking, CreateBookingVariables } from '@bridgeway/database';

// The `CreateBooking` mutation requires an argument of type `CreateBookingVariables`:
const createBookingVars: CreateBookingVariables = {
  orgId: ..., 
  serviceId: ..., // optional
  name: ..., 
  email: ..., // optional
  phone: ..., // optional
  preferredDate: ..., // optional
  preferredTime: ..., // optional
  notes: ..., // optional
  status: ..., 
  paymentStatus: ..., // optional
};

// Call the `createBooking()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createBooking(createBookingVars);
// Variables can be defined inline as well.
const { data } = await createBooking({ orgId: ..., serviceId: ..., name: ..., email: ..., phone: ..., preferredDate: ..., preferredTime: ..., notes: ..., status: ..., paymentStatus: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createBooking(dataConnect, createBookingVars);

console.log(data.booking_insert);

// Or, you can use the `Promise` API.
createBooking(createBookingVars).then((response) => {
  const data = response.data;
  console.log(data.booking_insert);
});
```

### Using `CreateBooking`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createBookingRef, CreateBookingVariables } from '@bridgeway/database';

// The `CreateBooking` mutation requires an argument of type `CreateBookingVariables`:
const createBookingVars: CreateBookingVariables = {
  orgId: ..., 
  serviceId: ..., // optional
  name: ..., 
  email: ..., // optional
  phone: ..., // optional
  preferredDate: ..., // optional
  preferredTime: ..., // optional
  notes: ..., // optional
  status: ..., 
  paymentStatus: ..., // optional
};

// Call the `createBookingRef()` function to get a reference to the mutation.
const ref = createBookingRef(createBookingVars);
// Variables can be defined inline as well.
const ref = createBookingRef({ orgId: ..., serviceId: ..., name: ..., email: ..., phone: ..., preferredDate: ..., preferredTime: ..., notes: ..., status: ..., paymentStatus: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createBookingRef(dataConnect, createBookingVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.booking_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.booking_insert);
});
```

## UpdateBooking
You can execute the `UpdateBooking` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
updateBooking(vars: UpdateBookingVariables): MutationPromise<UpdateBookingData, UpdateBookingVariables>;

interface UpdateBookingRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateBookingVariables): MutationRef<UpdateBookingData, UpdateBookingVariables>;
}
export const updateBookingRef: UpdateBookingRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateBooking(dc: DataConnect, vars: UpdateBookingVariables): MutationPromise<UpdateBookingData, UpdateBookingVariables>;

interface UpdateBookingRef {
  ...
  (dc: DataConnect, vars: UpdateBookingVariables): MutationRef<UpdateBookingData, UpdateBookingVariables>;
}
export const updateBookingRef: UpdateBookingRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateBookingRef:
```typescript
const name = updateBookingRef.operationName;
console.log(name);
```

### Variables
The `UpdateBooking` mutation requires an argument of type `UpdateBookingVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateBookingVariables {
  id: UUIDString;
  status?: string | null;
  paymentStatus?: string | null;
  reminder24hSent?: boolean | null;
  reminder2hSent?: boolean | null;
  googleEventId?: string | null;
  googleEventLink?: string | null;
}
```
### Return Type
Recall that executing the `UpdateBooking` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateBookingData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateBookingData {
  booking_update?: Booking_Key | null;
}
```
### Using `UpdateBooking`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateBooking, UpdateBookingVariables } from '@bridgeway/database';

// The `UpdateBooking` mutation requires an argument of type `UpdateBookingVariables`:
const updateBookingVars: UpdateBookingVariables = {
  id: ..., 
  status: ..., // optional
  paymentStatus: ..., // optional
  reminder24hSent: ..., // optional
  reminder2hSent: ..., // optional
  googleEventId: ..., // optional
  googleEventLink: ..., // optional
};

// Call the `updateBooking()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateBooking(updateBookingVars);
// Variables can be defined inline as well.
const { data } = await updateBooking({ id: ..., status: ..., paymentStatus: ..., reminder24hSent: ..., reminder2hSent: ..., googleEventId: ..., googleEventLink: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateBooking(dataConnect, updateBookingVars);

console.log(data.booking_update);

// Or, you can use the `Promise` API.
updateBooking(updateBookingVars).then((response) => {
  const data = response.data;
  console.log(data.booking_update);
});
```

### Using `UpdateBooking`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateBookingRef, UpdateBookingVariables } from '@bridgeway/database';

// The `UpdateBooking` mutation requires an argument of type `UpdateBookingVariables`:
const updateBookingVars: UpdateBookingVariables = {
  id: ..., 
  status: ..., // optional
  paymentStatus: ..., // optional
  reminder24hSent: ..., // optional
  reminder2hSent: ..., // optional
  googleEventId: ..., // optional
  googleEventLink: ..., // optional
};

// Call the `updateBookingRef()` function to get a reference to the mutation.
const ref = updateBookingRef(updateBookingVars);
// Variables can be defined inline as well.
const ref = updateBookingRef({ id: ..., status: ..., paymentStatus: ..., reminder24hSent: ..., reminder2hSent: ..., googleEventId: ..., googleEventLink: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateBookingRef(dataConnect, updateBookingVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.booking_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.booking_update);
});
```

## UpdateOrgGoogleCalendar
You can execute the `UpdateOrgGoogleCalendar` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
updateOrgGoogleCalendar(vars: UpdateOrgGoogleCalendarVariables): MutationPromise<UpdateOrgGoogleCalendarData, UpdateOrgGoogleCalendarVariables>;

interface UpdateOrgGoogleCalendarRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateOrgGoogleCalendarVariables): MutationRef<UpdateOrgGoogleCalendarData, UpdateOrgGoogleCalendarVariables>;
}
export const updateOrgGoogleCalendarRef: UpdateOrgGoogleCalendarRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateOrgGoogleCalendar(dc: DataConnect, vars: UpdateOrgGoogleCalendarVariables): MutationPromise<UpdateOrgGoogleCalendarData, UpdateOrgGoogleCalendarVariables>;

interface UpdateOrgGoogleCalendarRef {
  ...
  (dc: DataConnect, vars: UpdateOrgGoogleCalendarVariables): MutationRef<UpdateOrgGoogleCalendarData, UpdateOrgGoogleCalendarVariables>;
}
export const updateOrgGoogleCalendarRef: UpdateOrgGoogleCalendarRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateOrgGoogleCalendarRef:
```typescript
const name = updateOrgGoogleCalendarRef.operationName;
console.log(name);
```

### Variables
The `UpdateOrgGoogleCalendar` mutation requires an argument of type `UpdateOrgGoogleCalendarVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateOrgGoogleCalendarVariables {
  orgId: UUIDString;
  externalCalendarSyncEnabled?: boolean | null;
  googleRefreshToken?: string | null;
  googleAccessToken?: string | null;
  googleTokenExpiry?: number | null;
  externalCalendarId?: string | null;
  externalCalendarType?: string | null;
}
```
### Return Type
Recall that executing the `UpdateOrgGoogleCalendar` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateOrgGoogleCalendarData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateOrgGoogleCalendarData {
  orgSetting_upsert: OrgSetting_Key;
}
```
### Using `UpdateOrgGoogleCalendar`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateOrgGoogleCalendar, UpdateOrgGoogleCalendarVariables } from '@bridgeway/database';

// The `UpdateOrgGoogleCalendar` mutation requires an argument of type `UpdateOrgGoogleCalendarVariables`:
const updateOrgGoogleCalendarVars: UpdateOrgGoogleCalendarVariables = {
  orgId: ..., 
  externalCalendarSyncEnabled: ..., // optional
  googleRefreshToken: ..., // optional
  googleAccessToken: ..., // optional
  googleTokenExpiry: ..., // optional
  externalCalendarId: ..., // optional
  externalCalendarType: ..., // optional
};

// Call the `updateOrgGoogleCalendar()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateOrgGoogleCalendar(updateOrgGoogleCalendarVars);
// Variables can be defined inline as well.
const { data } = await updateOrgGoogleCalendar({ orgId: ..., externalCalendarSyncEnabled: ..., googleRefreshToken: ..., googleAccessToken: ..., googleTokenExpiry: ..., externalCalendarId: ..., externalCalendarType: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateOrgGoogleCalendar(dataConnect, updateOrgGoogleCalendarVars);

console.log(data.orgSetting_upsert);

// Or, you can use the `Promise` API.
updateOrgGoogleCalendar(updateOrgGoogleCalendarVars).then((response) => {
  const data = response.data;
  console.log(data.orgSetting_upsert);
});
```

### Using `UpdateOrgGoogleCalendar`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateOrgGoogleCalendarRef, UpdateOrgGoogleCalendarVariables } from '@bridgeway/database';

// The `UpdateOrgGoogleCalendar` mutation requires an argument of type `UpdateOrgGoogleCalendarVariables`:
const updateOrgGoogleCalendarVars: UpdateOrgGoogleCalendarVariables = {
  orgId: ..., 
  externalCalendarSyncEnabled: ..., // optional
  googleRefreshToken: ..., // optional
  googleAccessToken: ..., // optional
  googleTokenExpiry: ..., // optional
  externalCalendarId: ..., // optional
  externalCalendarType: ..., // optional
};

// Call the `updateOrgGoogleCalendarRef()` function to get a reference to the mutation.
const ref = updateOrgGoogleCalendarRef(updateOrgGoogleCalendarVars);
// Variables can be defined inline as well.
const ref = updateOrgGoogleCalendarRef({ orgId: ..., externalCalendarSyncEnabled: ..., googleRefreshToken: ..., googleAccessToken: ..., googleTokenExpiry: ..., externalCalendarId: ..., externalCalendarType: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateOrgGoogleCalendarRef(dataConnect, updateOrgGoogleCalendarVars);

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

## UpdateAppointmentStatus
You can execute the `UpdateAppointmentStatus` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
updateAppointmentStatus(vars: UpdateAppointmentStatusVariables): MutationPromise<UpdateAppointmentStatusData, UpdateAppointmentStatusVariables>;

interface UpdateAppointmentStatusRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateAppointmentStatusVariables): MutationRef<UpdateAppointmentStatusData, UpdateAppointmentStatusVariables>;
}
export const updateAppointmentStatusRef: UpdateAppointmentStatusRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateAppointmentStatus(dc: DataConnect, vars: UpdateAppointmentStatusVariables): MutationPromise<UpdateAppointmentStatusData, UpdateAppointmentStatusVariables>;

interface UpdateAppointmentStatusRef {
  ...
  (dc: DataConnect, vars: UpdateAppointmentStatusVariables): MutationRef<UpdateAppointmentStatusData, UpdateAppointmentStatusVariables>;
}
export const updateAppointmentStatusRef: UpdateAppointmentStatusRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateAppointmentStatusRef:
```typescript
const name = updateAppointmentStatusRef.operationName;
console.log(name);
```

### Variables
The `UpdateAppointmentStatus` mutation requires an argument of type `UpdateAppointmentStatusVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateAppointmentStatusVariables {
  id: UUIDString;
  status: string;
}
```
### Return Type
Recall that executing the `UpdateAppointmentStatus` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateAppointmentStatusData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateAppointmentStatusData {
  appointment_update?: Appointment_Key | null;
}
```
### Using `UpdateAppointmentStatus`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateAppointmentStatus, UpdateAppointmentStatusVariables } from '@bridgeway/database';

// The `UpdateAppointmentStatus` mutation requires an argument of type `UpdateAppointmentStatusVariables`:
const updateAppointmentStatusVars: UpdateAppointmentStatusVariables = {
  id: ..., 
  status: ..., 
};

// Call the `updateAppointmentStatus()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateAppointmentStatus(updateAppointmentStatusVars);
// Variables can be defined inline as well.
const { data } = await updateAppointmentStatus({ id: ..., status: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateAppointmentStatus(dataConnect, updateAppointmentStatusVars);

console.log(data.appointment_update);

// Or, you can use the `Promise` API.
updateAppointmentStatus(updateAppointmentStatusVars).then((response) => {
  const data = response.data;
  console.log(data.appointment_update);
});
```

### Using `UpdateAppointmentStatus`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateAppointmentStatusRef, UpdateAppointmentStatusVariables } from '@bridgeway/database';

// The `UpdateAppointmentStatus` mutation requires an argument of type `UpdateAppointmentStatusVariables`:
const updateAppointmentStatusVars: UpdateAppointmentStatusVariables = {
  id: ..., 
  status: ..., 
};

// Call the `updateAppointmentStatusRef()` function to get a reference to the mutation.
const ref = updateAppointmentStatusRef(updateAppointmentStatusVars);
// Variables can be defined inline as well.
const ref = updateAppointmentStatusRef({ id: ..., status: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateAppointmentStatusRef(dataConnect, updateAppointmentStatusVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.appointment_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.appointment_update);
});
```

## CreateAppointment
You can execute the `CreateAppointment` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
createAppointment(vars: CreateAppointmentVariables): MutationPromise<CreateAppointmentData, CreateAppointmentVariables>;

interface CreateAppointmentRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateAppointmentVariables): MutationRef<CreateAppointmentData, CreateAppointmentVariables>;
}
export const createAppointmentRef: CreateAppointmentRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createAppointment(dc: DataConnect, vars: CreateAppointmentVariables): MutationPromise<CreateAppointmentData, CreateAppointmentVariables>;

interface CreateAppointmentRef {
  ...
  (dc: DataConnect, vars: CreateAppointmentVariables): MutationRef<CreateAppointmentData, CreateAppointmentVariables>;
}
export const createAppointmentRef: CreateAppointmentRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createAppointmentRef:
```typescript
const name = createAppointmentRef.operationName;
console.log(name);
```

### Variables
The `CreateAppointment` mutation requires an argument of type `CreateAppointmentVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateAppointmentVariables {
  orgId: UUIDString;
  clientId: UUIDString;
  serviceId?: UUIDString | null;
  staffId?: UUIDString | null;
  scheduledAt: TimestampString;
  durationMinutes?: number | null;
  status: string;
  amount: number;
  notes?: string | null;
}
```
### Return Type
Recall that executing the `CreateAppointment` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateAppointmentData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateAppointmentData {
  appointment_insert: Appointment_Key;
}
```
### Using `CreateAppointment`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createAppointment, CreateAppointmentVariables } from '@bridgeway/database';

// The `CreateAppointment` mutation requires an argument of type `CreateAppointmentVariables`:
const createAppointmentVars: CreateAppointmentVariables = {
  orgId: ..., 
  clientId: ..., 
  serviceId: ..., // optional
  staffId: ..., // optional
  scheduledAt: ..., 
  durationMinutes: ..., // optional
  status: ..., 
  amount: ..., 
  notes: ..., // optional
};

// Call the `createAppointment()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createAppointment(createAppointmentVars);
// Variables can be defined inline as well.
const { data } = await createAppointment({ orgId: ..., clientId: ..., serviceId: ..., staffId: ..., scheduledAt: ..., durationMinutes: ..., status: ..., amount: ..., notes: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createAppointment(dataConnect, createAppointmentVars);

console.log(data.appointment_insert);

// Or, you can use the `Promise` API.
createAppointment(createAppointmentVars).then((response) => {
  const data = response.data;
  console.log(data.appointment_insert);
});
```

### Using `CreateAppointment`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createAppointmentRef, CreateAppointmentVariables } from '@bridgeway/database';

// The `CreateAppointment` mutation requires an argument of type `CreateAppointmentVariables`:
const createAppointmentVars: CreateAppointmentVariables = {
  orgId: ..., 
  clientId: ..., 
  serviceId: ..., // optional
  staffId: ..., // optional
  scheduledAt: ..., 
  durationMinutes: ..., // optional
  status: ..., 
  amount: ..., 
  notes: ..., // optional
};

// Call the `createAppointmentRef()` function to get a reference to the mutation.
const ref = createAppointmentRef(createAppointmentVars);
// Variables can be defined inline as well.
const ref = createAppointmentRef({ orgId: ..., clientId: ..., serviceId: ..., staffId: ..., scheduledAt: ..., durationMinutes: ..., status: ..., amount: ..., notes: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createAppointmentRef(dataConnect, createAppointmentVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.appointment_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.appointment_insert);
});
```

## CreateService
You can execute the `CreateService` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
createService(vars: CreateServiceVariables): MutationPromise<CreateServiceData, CreateServiceVariables>;

interface CreateServiceRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateServiceVariables): MutationRef<CreateServiceData, CreateServiceVariables>;
}
export const createServiceRef: CreateServiceRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createService(dc: DataConnect, vars: CreateServiceVariables): MutationPromise<CreateServiceData, CreateServiceVariables>;

interface CreateServiceRef {
  ...
  (dc: DataConnect, vars: CreateServiceVariables): MutationRef<CreateServiceData, CreateServiceVariables>;
}
export const createServiceRef: CreateServiceRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createServiceRef:
```typescript
const name = createServiceRef.operationName;
console.log(name);
```

### Variables
The `CreateService` mutation requires an argument of type `CreateServiceVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateServiceVariables {
  orgId: UUIDString;
  name: string;
  description?: string | null;
  durationMinutes: number;
  price: number;
}
```
### Return Type
Recall that executing the `CreateService` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateServiceData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateServiceData {
  service_insert: Service_Key;
}
```
### Using `CreateService`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createService, CreateServiceVariables } from '@bridgeway/database';

// The `CreateService` mutation requires an argument of type `CreateServiceVariables`:
const createServiceVars: CreateServiceVariables = {
  orgId: ..., 
  name: ..., 
  description: ..., // optional
  durationMinutes: ..., 
  price: ..., 
};

// Call the `createService()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createService(createServiceVars);
// Variables can be defined inline as well.
const { data } = await createService({ orgId: ..., name: ..., description: ..., durationMinutes: ..., price: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createService(dataConnect, createServiceVars);

console.log(data.service_insert);

// Or, you can use the `Promise` API.
createService(createServiceVars).then((response) => {
  const data = response.data;
  console.log(data.service_insert);
});
```

### Using `CreateService`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createServiceRef, CreateServiceVariables } from '@bridgeway/database';

// The `CreateService` mutation requires an argument of type `CreateServiceVariables`:
const createServiceVars: CreateServiceVariables = {
  orgId: ..., 
  name: ..., 
  description: ..., // optional
  durationMinutes: ..., 
  price: ..., 
};

// Call the `createServiceRef()` function to get a reference to the mutation.
const ref = createServiceRef(createServiceVars);
// Variables can be defined inline as well.
const ref = createServiceRef({ orgId: ..., name: ..., description: ..., durationMinutes: ..., price: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createServiceRef(dataConnect, createServiceVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.service_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.service_insert);
});
```

## CreateClient
You can execute the `CreateClient` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
createClient(vars: CreateClientVariables): MutationPromise<CreateClientData, CreateClientVariables>;

interface CreateClientRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateClientVariables): MutationRef<CreateClientData, CreateClientVariables>;
}
export const createClientRef: CreateClientRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createClient(dc: DataConnect, vars: CreateClientVariables): MutationPromise<CreateClientData, CreateClientVariables>;

interface CreateClientRef {
  ...
  (dc: DataConnect, vars: CreateClientVariables): MutationRef<CreateClientData, CreateClientVariables>;
}
export const createClientRef: CreateClientRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createClientRef:
```typescript
const name = createClientRef.operationName;
console.log(name);
```

### Variables
The `CreateClient` mutation requires an argument of type `CreateClientVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateClientVariables {
  orgId: UUIDString;
  name: string;
  email?: string | null;
  phone?: string | null;
  dateOfBirth?: DateString | null;
  address?: string | null;
  notes?: string | null;
}
```
### Return Type
Recall that executing the `CreateClient` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateClientData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateClientData {
  client_insert: Client_Key;
}
```
### Using `CreateClient`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createClient, CreateClientVariables } from '@bridgeway/database';

// The `CreateClient` mutation requires an argument of type `CreateClientVariables`:
const createClientVars: CreateClientVariables = {
  orgId: ..., 
  name: ..., 
  email: ..., // optional
  phone: ..., // optional
  dateOfBirth: ..., // optional
  address: ..., // optional
  notes: ..., // optional
};

// Call the `createClient()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createClient(createClientVars);
// Variables can be defined inline as well.
const { data } = await createClient({ orgId: ..., name: ..., email: ..., phone: ..., dateOfBirth: ..., address: ..., notes: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createClient(dataConnect, createClientVars);

console.log(data.client_insert);

// Or, you can use the `Promise` API.
createClient(createClientVars).then((response) => {
  const data = response.data;
  console.log(data.client_insert);
});
```

### Using `CreateClient`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createClientRef, CreateClientVariables } from '@bridgeway/database';

// The `CreateClient` mutation requires an argument of type `CreateClientVariables`:
const createClientVars: CreateClientVariables = {
  orgId: ..., 
  name: ..., 
  email: ..., // optional
  phone: ..., // optional
  dateOfBirth: ..., // optional
  address: ..., // optional
  notes: ..., // optional
};

// Call the `createClientRef()` function to get a reference to the mutation.
const ref = createClientRef(createClientVars);
// Variables can be defined inline as well.
const ref = createClientRef({ orgId: ..., name: ..., email: ..., phone: ..., dateOfBirth: ..., address: ..., notes: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createClientRef(dataConnect, createClientVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.client_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.client_insert);
});
```

## UpdateClient
You can execute the `UpdateClient` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
updateClient(vars: UpdateClientVariables): MutationPromise<UpdateClientData, UpdateClientVariables>;

interface UpdateClientRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateClientVariables): MutationRef<UpdateClientData, UpdateClientVariables>;
}
export const updateClientRef: UpdateClientRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateClient(dc: DataConnect, vars: UpdateClientVariables): MutationPromise<UpdateClientData, UpdateClientVariables>;

interface UpdateClientRef {
  ...
  (dc: DataConnect, vars: UpdateClientVariables): MutationRef<UpdateClientData, UpdateClientVariables>;
}
export const updateClientRef: UpdateClientRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateClientRef:
```typescript
const name = updateClientRef.operationName;
console.log(name);
```

### Variables
The `UpdateClient` mutation requires an argument of type `UpdateClientVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateClientVariables {
  id: UUIDString;
  name: string;
  email?: string | null;
  phone?: string | null;
  dateOfBirth?: DateString | null;
  address?: string | null;
  notes?: string | null;
}
```
### Return Type
Recall that executing the `UpdateClient` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateClientData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateClientData {
  client_update?: Client_Key | null;
}
```
### Using `UpdateClient`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateClient, UpdateClientVariables } from '@bridgeway/database';

// The `UpdateClient` mutation requires an argument of type `UpdateClientVariables`:
const updateClientVars: UpdateClientVariables = {
  id: ..., 
  name: ..., 
  email: ..., // optional
  phone: ..., // optional
  dateOfBirth: ..., // optional
  address: ..., // optional
  notes: ..., // optional
};

// Call the `updateClient()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateClient(updateClientVars);
// Variables can be defined inline as well.
const { data } = await updateClient({ id: ..., name: ..., email: ..., phone: ..., dateOfBirth: ..., address: ..., notes: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateClient(dataConnect, updateClientVars);

console.log(data.client_update);

// Or, you can use the `Promise` API.
updateClient(updateClientVars).then((response) => {
  const data = response.data;
  console.log(data.client_update);
});
```

### Using `UpdateClient`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateClientRef, UpdateClientVariables } from '@bridgeway/database';

// The `UpdateClient` mutation requires an argument of type `UpdateClientVariables`:
const updateClientVars: UpdateClientVariables = {
  id: ..., 
  name: ..., 
  email: ..., // optional
  phone: ..., // optional
  dateOfBirth: ..., // optional
  address: ..., // optional
  notes: ..., // optional
};

// Call the `updateClientRef()` function to get a reference to the mutation.
const ref = updateClientRef(updateClientVars);
// Variables can be defined inline as well.
const ref = updateClientRef({ id: ..., name: ..., email: ..., phone: ..., dateOfBirth: ..., address: ..., notes: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateClientRef(dataConnect, updateClientVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.client_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.client_update);
});
```

## CreateQueueEntry
You can execute the `CreateQueueEntry` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
createQueueEntry(vars: CreateQueueEntryVariables): MutationPromise<CreateQueueEntryData, CreateQueueEntryVariables>;

interface CreateQueueEntryRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateQueueEntryVariables): MutationRef<CreateQueueEntryData, CreateQueueEntryVariables>;
}
export const createQueueEntryRef: CreateQueueEntryRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createQueueEntry(dc: DataConnect, vars: CreateQueueEntryVariables): MutationPromise<CreateQueueEntryData, CreateQueueEntryVariables>;

interface CreateQueueEntryRef {
  ...
  (dc: DataConnect, vars: CreateQueueEntryVariables): MutationRef<CreateQueueEntryData, CreateQueueEntryVariables>;
}
export const createQueueEntryRef: CreateQueueEntryRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createQueueEntryRef:
```typescript
const name = createQueueEntryRef.operationName;
console.log(name);
```

### Variables
The `CreateQueueEntry` mutation requires an argument of type `CreateQueueEntryVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateQueueEntryVariables {
  orgId: UUIDString;
  clientName: string;
  serviceId?: UUIDString | null;
  status: string;
  position: number;
}
```
### Return Type
Recall that executing the `CreateQueueEntry` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateQueueEntryData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateQueueEntryData {
  queueEntry_insert: QueueEntry_Key;
}
```
### Using `CreateQueueEntry`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createQueueEntry, CreateQueueEntryVariables } from '@bridgeway/database';

// The `CreateQueueEntry` mutation requires an argument of type `CreateQueueEntryVariables`:
const createQueueEntryVars: CreateQueueEntryVariables = {
  orgId: ..., 
  clientName: ..., 
  serviceId: ..., // optional
  status: ..., 
  position: ..., 
};

// Call the `createQueueEntry()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createQueueEntry(createQueueEntryVars);
// Variables can be defined inline as well.
const { data } = await createQueueEntry({ orgId: ..., clientName: ..., serviceId: ..., status: ..., position: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createQueueEntry(dataConnect, createQueueEntryVars);

console.log(data.queueEntry_insert);

// Or, you can use the `Promise` API.
createQueueEntry(createQueueEntryVars).then((response) => {
  const data = response.data;
  console.log(data.queueEntry_insert);
});
```

### Using `CreateQueueEntry`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createQueueEntryRef, CreateQueueEntryVariables } from '@bridgeway/database';

// The `CreateQueueEntry` mutation requires an argument of type `CreateQueueEntryVariables`:
const createQueueEntryVars: CreateQueueEntryVariables = {
  orgId: ..., 
  clientName: ..., 
  serviceId: ..., // optional
  status: ..., 
  position: ..., 
};

// Call the `createQueueEntryRef()` function to get a reference to the mutation.
const ref = createQueueEntryRef(createQueueEntryVars);
// Variables can be defined inline as well.
const ref = createQueueEntryRef({ orgId: ..., clientName: ..., serviceId: ..., status: ..., position: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createQueueEntryRef(dataConnect, createQueueEntryVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.queueEntry_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.queueEntry_insert);
});
```

## UpdateQueueStatus
You can execute the `UpdateQueueStatus` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
updateQueueStatus(vars: UpdateQueueStatusVariables): MutationPromise<UpdateQueueStatusData, UpdateQueueStatusVariables>;

interface UpdateQueueStatusRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateQueueStatusVariables): MutationRef<UpdateQueueStatusData, UpdateQueueStatusVariables>;
}
export const updateQueueStatusRef: UpdateQueueStatusRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateQueueStatus(dc: DataConnect, vars: UpdateQueueStatusVariables): MutationPromise<UpdateQueueStatusData, UpdateQueueStatusVariables>;

interface UpdateQueueStatusRef {
  ...
  (dc: DataConnect, vars: UpdateQueueStatusVariables): MutationRef<UpdateQueueStatusData, UpdateQueueStatusVariables>;
}
export const updateQueueStatusRef: UpdateQueueStatusRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateQueueStatusRef:
```typescript
const name = updateQueueStatusRef.operationName;
console.log(name);
```

### Variables
The `UpdateQueueStatus` mutation requires an argument of type `UpdateQueueStatusVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateQueueStatusVariables {
  id: UUIDString;
  status?: string | null;
  position?: number | null;
  calledAt?: TimestampString | null;
  completedAt?: TimestampString | null;
}
```
### Return Type
Recall that executing the `UpdateQueueStatus` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateQueueStatusData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateQueueStatusData {
  queueEntry_update?: QueueEntry_Key | null;
}
```
### Using `UpdateQueueStatus`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateQueueStatus, UpdateQueueStatusVariables } from '@bridgeway/database';

// The `UpdateQueueStatus` mutation requires an argument of type `UpdateQueueStatusVariables`:
const updateQueueStatusVars: UpdateQueueStatusVariables = {
  id: ..., 
  status: ..., // optional
  position: ..., // optional
  calledAt: ..., // optional
  completedAt: ..., // optional
};

// Call the `updateQueueStatus()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateQueueStatus(updateQueueStatusVars);
// Variables can be defined inline as well.
const { data } = await updateQueueStatus({ id: ..., status: ..., position: ..., calledAt: ..., completedAt: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateQueueStatus(dataConnect, updateQueueStatusVars);

console.log(data.queueEntry_update);

// Or, you can use the `Promise` API.
updateQueueStatus(updateQueueStatusVars).then((response) => {
  const data = response.data;
  console.log(data.queueEntry_update);
});
```

### Using `UpdateQueueStatus`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateQueueStatusRef, UpdateQueueStatusVariables } from '@bridgeway/database';

// The `UpdateQueueStatus` mutation requires an argument of type `UpdateQueueStatusVariables`:
const updateQueueStatusVars: UpdateQueueStatusVariables = {
  id: ..., 
  status: ..., // optional
  position: ..., // optional
  calledAt: ..., // optional
  completedAt: ..., // optional
};

// Call the `updateQueueStatusRef()` function to get a reference to the mutation.
const ref = updateQueueStatusRef(updateQueueStatusVars);
// Variables can be defined inline as well.
const ref = updateQueueStatusRef({ id: ..., status: ..., position: ..., calledAt: ..., completedAt: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateQueueStatusRef(dataConnect, updateQueueStatusVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.queueEntry_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.queueEntry_update);
});
```

## DeleteQueueEntry
You can execute the `DeleteQueueEntry` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
deleteQueueEntry(vars: DeleteQueueEntryVariables): MutationPromise<DeleteQueueEntryData, DeleteQueueEntryVariables>;

interface DeleteQueueEntryRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteQueueEntryVariables): MutationRef<DeleteQueueEntryData, DeleteQueueEntryVariables>;
}
export const deleteQueueEntryRef: DeleteQueueEntryRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteQueueEntry(dc: DataConnect, vars: DeleteQueueEntryVariables): MutationPromise<DeleteQueueEntryData, DeleteQueueEntryVariables>;

interface DeleteQueueEntryRef {
  ...
  (dc: DataConnect, vars: DeleteQueueEntryVariables): MutationRef<DeleteQueueEntryData, DeleteQueueEntryVariables>;
}
export const deleteQueueEntryRef: DeleteQueueEntryRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteQueueEntryRef:
```typescript
const name = deleteQueueEntryRef.operationName;
console.log(name);
```

### Variables
The `DeleteQueueEntry` mutation requires an argument of type `DeleteQueueEntryVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteQueueEntryVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteQueueEntry` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteQueueEntryData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteQueueEntryData {
  queueEntry_delete?: QueueEntry_Key | null;
}
```
### Using `DeleteQueueEntry`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteQueueEntry, DeleteQueueEntryVariables } from '@bridgeway/database';

// The `DeleteQueueEntry` mutation requires an argument of type `DeleteQueueEntryVariables`:
const deleteQueueEntryVars: DeleteQueueEntryVariables = {
  id: ..., 
};

// Call the `deleteQueueEntry()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteQueueEntry(deleteQueueEntryVars);
// Variables can be defined inline as well.
const { data } = await deleteQueueEntry({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteQueueEntry(dataConnect, deleteQueueEntryVars);

console.log(data.queueEntry_delete);

// Or, you can use the `Promise` API.
deleteQueueEntry(deleteQueueEntryVars).then((response) => {
  const data = response.data;
  console.log(data.queueEntry_delete);
});
```

### Using `DeleteQueueEntry`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteQueueEntryRef, DeleteQueueEntryVariables } from '@bridgeway/database';

// The `DeleteQueueEntry` mutation requires an argument of type `DeleteQueueEntryVariables`:
const deleteQueueEntryVars: DeleteQueueEntryVariables = {
  id: ..., 
};

// Call the `deleteQueueEntryRef()` function to get a reference to the mutation.
const ref = deleteQueueEntryRef(deleteQueueEntryVars);
// Variables can be defined inline as well.
const ref = deleteQueueEntryRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteQueueEntryRef(dataConnect, deleteQueueEntryVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.queueEntry_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.queueEntry_delete);
});
```

## CreateClientPackage
You can execute the `CreateClientPackage` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
createClientPackage(vars: CreateClientPackageVariables): MutationPromise<CreateClientPackageData, CreateClientPackageVariables>;

interface CreateClientPackageRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateClientPackageVariables): MutationRef<CreateClientPackageData, CreateClientPackageVariables>;
}
export const createClientPackageRef: CreateClientPackageRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createClientPackage(dc: DataConnect, vars: CreateClientPackageVariables): MutationPromise<CreateClientPackageData, CreateClientPackageVariables>;

interface CreateClientPackageRef {
  ...
  (dc: DataConnect, vars: CreateClientPackageVariables): MutationRef<CreateClientPackageData, CreateClientPackageVariables>;
}
export const createClientPackageRef: CreateClientPackageRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createClientPackageRef:
```typescript
const name = createClientPackageRef.operationName;
console.log(name);
```

### Variables
The `CreateClientPackage` mutation requires an argument of type `CreateClientPackageVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateClientPackageVariables {
  orgId: UUIDString;
  clientId: UUIDString;
  name: string;
  totalSessions: number;
  price: number;
  expiresAt?: TimestampString | null;
}
```
### Return Type
Recall that executing the `CreateClientPackage` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateClientPackageData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateClientPackageData {
  clientPackage_insert: ClientPackage_Key;
}
```
### Using `CreateClientPackage`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createClientPackage, CreateClientPackageVariables } from '@bridgeway/database';

// The `CreateClientPackage` mutation requires an argument of type `CreateClientPackageVariables`:
const createClientPackageVars: CreateClientPackageVariables = {
  orgId: ..., 
  clientId: ..., 
  name: ..., 
  totalSessions: ..., 
  price: ..., 
  expiresAt: ..., // optional
};

// Call the `createClientPackage()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createClientPackage(createClientPackageVars);
// Variables can be defined inline as well.
const { data } = await createClientPackage({ orgId: ..., clientId: ..., name: ..., totalSessions: ..., price: ..., expiresAt: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createClientPackage(dataConnect, createClientPackageVars);

console.log(data.clientPackage_insert);

// Or, you can use the `Promise` API.
createClientPackage(createClientPackageVars).then((response) => {
  const data = response.data;
  console.log(data.clientPackage_insert);
});
```

### Using `CreateClientPackage`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createClientPackageRef, CreateClientPackageVariables } from '@bridgeway/database';

// The `CreateClientPackage` mutation requires an argument of type `CreateClientPackageVariables`:
const createClientPackageVars: CreateClientPackageVariables = {
  orgId: ..., 
  clientId: ..., 
  name: ..., 
  totalSessions: ..., 
  price: ..., 
  expiresAt: ..., // optional
};

// Call the `createClientPackageRef()` function to get a reference to the mutation.
const ref = createClientPackageRef(createClientPackageVars);
// Variables can be defined inline as well.
const ref = createClientPackageRef({ orgId: ..., clientId: ..., name: ..., totalSessions: ..., price: ..., expiresAt: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createClientPackageRef(dataConnect, createClientPackageVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.clientPackage_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.clientPackage_insert);
});
```

## LogActivity
You can execute the `LogActivity` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
logActivity(vars: LogActivityVariables): MutationPromise<LogActivityData, LogActivityVariables>;

interface LogActivityRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: LogActivityVariables): MutationRef<LogActivityData, LogActivityVariables>;
}
export const logActivityRef: LogActivityRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
logActivity(dc: DataConnect, vars: LogActivityVariables): MutationPromise<LogActivityData, LogActivityVariables>;

interface LogActivityRef {
  ...
  (dc: DataConnect, vars: LogActivityVariables): MutationRef<LogActivityData, LogActivityVariables>;
}
export const logActivityRef: LogActivityRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the logActivityRef:
```typescript
const name = logActivityRef.operationName;
console.log(name);
```

### Variables
The `LogActivity` mutation requires an argument of type `LogActivityVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface LogActivityVariables {
  orgId: UUIDString;
  userId?: string | null;
  action: string;
  entityType?: string | null;
  entityId?: UUIDString | null;
  metadata?: unknown | null;
}
```
### Return Type
Recall that executing the `LogActivity` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `LogActivityData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface LogActivityData {
  activityLog_insert: ActivityLog_Key;
}
```
### Using `LogActivity`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, logActivity, LogActivityVariables } from '@bridgeway/database';

// The `LogActivity` mutation requires an argument of type `LogActivityVariables`:
const logActivityVars: LogActivityVariables = {
  orgId: ..., 
  userId: ..., // optional
  action: ..., 
  entityType: ..., // optional
  entityId: ..., // optional
  metadata: ..., // optional
};

// Call the `logActivity()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await logActivity(logActivityVars);
// Variables can be defined inline as well.
const { data } = await logActivity({ orgId: ..., userId: ..., action: ..., entityType: ..., entityId: ..., metadata: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await logActivity(dataConnect, logActivityVars);

console.log(data.activityLog_insert);

// Or, you can use the `Promise` API.
logActivity(logActivityVars).then((response) => {
  const data = response.data;
  console.log(data.activityLog_insert);
});
```

### Using `LogActivity`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, logActivityRef, LogActivityVariables } from '@bridgeway/database';

// The `LogActivity` mutation requires an argument of type `LogActivityVariables`:
const logActivityVars: LogActivityVariables = {
  orgId: ..., 
  userId: ..., // optional
  action: ..., 
  entityType: ..., // optional
  entityId: ..., // optional
  metadata: ..., // optional
};

// Call the `logActivityRef()` function to get a reference to the mutation.
const ref = logActivityRef(logActivityVars);
// Variables can be defined inline as well.
const ref = logActivityRef({ orgId: ..., userId: ..., action: ..., entityType: ..., entityId: ..., metadata: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = logActivityRef(dataConnect, logActivityVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.activityLog_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.activityLog_insert);
});
```

## MarkNotificationRead
You can execute the `MarkNotificationRead` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
markNotificationRead(vars: MarkNotificationReadVariables): MutationPromise<MarkNotificationReadData, MarkNotificationReadVariables>;

interface MarkNotificationReadRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: MarkNotificationReadVariables): MutationRef<MarkNotificationReadData, MarkNotificationReadVariables>;
}
export const markNotificationReadRef: MarkNotificationReadRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
markNotificationRead(dc: DataConnect, vars: MarkNotificationReadVariables): MutationPromise<MarkNotificationReadData, MarkNotificationReadVariables>;

interface MarkNotificationReadRef {
  ...
  (dc: DataConnect, vars: MarkNotificationReadVariables): MutationRef<MarkNotificationReadData, MarkNotificationReadVariables>;
}
export const markNotificationReadRef: MarkNotificationReadRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the markNotificationReadRef:
```typescript
const name = markNotificationReadRef.operationName;
console.log(name);
```

### Variables
The `MarkNotificationRead` mutation requires an argument of type `MarkNotificationReadVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface MarkNotificationReadVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `MarkNotificationRead` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `MarkNotificationReadData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface MarkNotificationReadData {
  inAppNotification_update?: InAppNotification_Key | null;
}
```
### Using `MarkNotificationRead`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, markNotificationRead, MarkNotificationReadVariables } from '@bridgeway/database';

// The `MarkNotificationRead` mutation requires an argument of type `MarkNotificationReadVariables`:
const markNotificationReadVars: MarkNotificationReadVariables = {
  id: ..., 
};

// Call the `markNotificationRead()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await markNotificationRead(markNotificationReadVars);
// Variables can be defined inline as well.
const { data } = await markNotificationRead({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await markNotificationRead(dataConnect, markNotificationReadVars);

console.log(data.inAppNotification_update);

// Or, you can use the `Promise` API.
markNotificationRead(markNotificationReadVars).then((response) => {
  const data = response.data;
  console.log(data.inAppNotification_update);
});
```

### Using `MarkNotificationRead`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, markNotificationReadRef, MarkNotificationReadVariables } from '@bridgeway/database';

// The `MarkNotificationRead` mutation requires an argument of type `MarkNotificationReadVariables`:
const markNotificationReadVars: MarkNotificationReadVariables = {
  id: ..., 
};

// Call the `markNotificationReadRef()` function to get a reference to the mutation.
const ref = markNotificationReadRef(markNotificationReadVars);
// Variables can be defined inline as well.
const ref = markNotificationReadRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = markNotificationReadRef(dataConnect, markNotificationReadVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.inAppNotification_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.inAppNotification_update);
});
```

