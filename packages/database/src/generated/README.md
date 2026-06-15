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
  - [*GetPosProducts*](#getposproducts)
  - [*GetProductsForInventory*](#getproductsforinventory)
  - [*GetStaffShifts*](#getstaffshifts)
  - [*GetUpcomingSlots*](#getupcomingslots)
  - [*GetAvailableSlotsForBooking*](#getavailableslotsforbooking)
  - [*GetClasses*](#getclasses)
  - [*GetActiveClassesForBooking*](#getactiveclassesforbooking)
  - [*GetClassRegistrationsForReports*](#getclassregistrationsforreports)
  - [*GetClassesForReports*](#getclassesforreports)
  - [*GetExistingRegistration*](#getexistingregistration)
  - [*GetClassRegistrationsCount*](#getclassregistrationscount)
  - [*GetWidgetConfig*](#getwidgetconfig)
  - [*GetAppointmentsForReports*](#getappointmentsforreports)
  - [*GetClientsForReports*](#getclientsforreports)
  - [*GetActiveIntakeTemplates*](#getactiveintaketemplates)
  - [*GetIntakeSubmissions*](#getintakesubmissions)
  - [*GetClientDocuments*](#getclientdocuments)
  - [*GetAnnouncements*](#getannouncements)
  - [*GetClassRegistrationsForAttendance*](#getclassregistrationsforattendance)
  - [*GetClientsForRetention*](#getclientsforretention)
  - [*GetCompletedAppointmentsForRetention*](#getcompletedappointmentsforretention)
  - [*GetOrgClientPackages*](#getorgclientpackages)
  - [*GetFloorLayout*](#getfloorlayout)
  - [*GetTodayFloorAppointments*](#gettodayfloorappointments)
  - [*GetUnconfirmedAppointments*](#getunconfirmedappointments)
  - [*GetPendingOrgBookings*](#getpendingorgbookings)
  - [*GetOrgWaitlist*](#getorgwaitlist)
  - [*GetOrgActivityLogs*](#getorgactivitylogs)
  - [*GetOrgPosTransactions*](#getorgpostransactions)
  - [*GetOrgById*](#getorgbyid)
  - [*GetOrgIntakeTemplates*](#getorgintaketemplates)
  - [*GetOrgServices*](#getorgservices)
  - [*GetMarketingTriggers*](#getmarketingtriggers)
  - [*GetNotificationSettings*](#getnotificationsettings)
  - [*GetOrgPackageTemplates*](#getorgpackagetemplates)
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
  - [*CreateProduct*](#createproduct)
  - [*UpdateProduct*](#updateproduct)
  - [*UpdateProductStock*](#updateproductstock)
  - [*CreatePosTransaction*](#createpostransaction)
  - [*CreateStaffShift*](#createstaffshift)
  - [*DeleteStaffShift*](#deletestaffshift)
  - [*CreateSlot*](#createslot)
  - [*UpdateSlotStatus*](#updateslotstatus)
  - [*DeleteSlot*](#deleteslot)
  - [*CreateClass*](#createclass)
  - [*UpdateClass*](#updateclass)
  - [*UpdateClassActiveStatus*](#updateclassactivestatus)
  - [*CreateClassRegistration*](#createclassregistration)
  - [*UpsertWidgetConfig*](#upsertwidgetconfig)
  - [*UpdateProfileInfo*](#updateprofileinfo)
  - [*CreateIntakeSubmission*](#createintakesubmission)
  - [*UpdateClientPackageSessions*](#updateclientpackagesessions)
  - [*CreateAnnouncement*](#createannouncement)
  - [*DeleteAnnouncement*](#deleteannouncement)
  - [*UpdateClassRegistrationStatus*](#updateclassregistrationstatus)
  - [*AssignSeat*](#assignseat)
  - [*ClearSeat*](#clearseat)
  - [*UpdateOrgStripeCredentials*](#updateorgstripecredentials)
  - [*UpdateProfileCommissionRate*](#updateprofilecommissionrate)
  - [*CreateIntakeTemplate*](#createintaketemplate)
  - [*UpdateIntakeTemplate*](#updateintaketemplate)
  - [*DeleteIntakeTemplate*](#deleteintaketemplate)
  - [*UpdateService*](#updateservice)
  - [*ToggleServiceArchive*](#toggleservicearchive)
  - [*CreateMarketingTrigger*](#createmarketingtrigger)
  - [*UpdateMarketingTrigger*](#updatemarketingtrigger)
  - [*UpsertNotificationSettings*](#upsertnotificationsettings)
  - [*UpdateOrgPatientCheckin*](#updateorgpatientcheckin)
  - [*CreatePackageTemplate*](#createpackagetemplate)
  - [*UpdatePackageTemplate*](#updatepackagetemplate)
  - [*TogglePackageTemplateActive*](#togglepackagetemplateactive)

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
      patientCheckinEnabled?: boolean | null;
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
    cancellationReason?: string | null;
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
    description?: string | null;
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
    phone?: string | null;
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

## GetPosProducts
You can execute the `GetPosProducts` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
getPosProducts(vars: GetPosProductsVariables, options?: ExecuteQueryOptions): QueryPromise<GetPosProductsData, GetPosProductsVariables>;

interface GetPosProductsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetPosProductsVariables): QueryRef<GetPosProductsData, GetPosProductsVariables>;
}
export const getPosProductsRef: GetPosProductsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getPosProducts(dc: DataConnect, vars: GetPosProductsVariables, options?: ExecuteQueryOptions): QueryPromise<GetPosProductsData, GetPosProductsVariables>;

interface GetPosProductsRef {
  ...
  (dc: DataConnect, vars: GetPosProductsVariables): QueryRef<GetPosProductsData, GetPosProductsVariables>;
}
export const getPosProductsRef: GetPosProductsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getPosProductsRef:
```typescript
const name = getPosProductsRef.operationName;
console.log(name);
```

### Variables
The `GetPosProducts` query requires an argument of type `GetPosProductsVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetPosProductsVariables {
  orgId: UUIDString;
}
```
### Return Type
Recall that executing the `GetPosProducts` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetPosProductsData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetPosProductsData {
  products: ({
    id: UUIDString;
    name: string;
    priceCents: number;
    stockCount?: number | null;
  } & Product_Key)[];
}
```
### Using `GetPosProducts`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getPosProducts, GetPosProductsVariables } from '@bridgeway/database';

// The `GetPosProducts` query requires an argument of type `GetPosProductsVariables`:
const getPosProductsVars: GetPosProductsVariables = {
  orgId: ..., 
};

// Call the `getPosProducts()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getPosProducts(getPosProductsVars);
// Variables can be defined inline as well.
const { data } = await getPosProducts({ orgId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getPosProducts(dataConnect, getPosProductsVars);

console.log(data.products);

// Or, you can use the `Promise` API.
getPosProducts(getPosProductsVars).then((response) => {
  const data = response.data;
  console.log(data.products);
});
```

### Using `GetPosProducts`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getPosProductsRef, GetPosProductsVariables } from '@bridgeway/database';

// The `GetPosProducts` query requires an argument of type `GetPosProductsVariables`:
const getPosProductsVars: GetPosProductsVariables = {
  orgId: ..., 
};

// Call the `getPosProductsRef()` function to get a reference to the query.
const ref = getPosProductsRef(getPosProductsVars);
// Variables can be defined inline as well.
const ref = getPosProductsRef({ orgId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getPosProductsRef(dataConnect, getPosProductsVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.products);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.products);
});
```

## GetProductsForInventory
You can execute the `GetProductsForInventory` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
getProductsForInventory(vars: GetProductsForInventoryVariables, options?: ExecuteQueryOptions): QueryPromise<GetProductsForInventoryData, GetProductsForInventoryVariables>;

interface GetProductsForInventoryRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetProductsForInventoryVariables): QueryRef<GetProductsForInventoryData, GetProductsForInventoryVariables>;
}
export const getProductsForInventoryRef: GetProductsForInventoryRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getProductsForInventory(dc: DataConnect, vars: GetProductsForInventoryVariables, options?: ExecuteQueryOptions): QueryPromise<GetProductsForInventoryData, GetProductsForInventoryVariables>;

interface GetProductsForInventoryRef {
  ...
  (dc: DataConnect, vars: GetProductsForInventoryVariables): QueryRef<GetProductsForInventoryData, GetProductsForInventoryVariables>;
}
export const getProductsForInventoryRef: GetProductsForInventoryRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getProductsForInventoryRef:
```typescript
const name = getProductsForInventoryRef.operationName;
console.log(name);
```

### Variables
The `GetProductsForInventory` query requires an argument of type `GetProductsForInventoryVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetProductsForInventoryVariables {
  orgId: UUIDString;
}
```
### Return Type
Recall that executing the `GetProductsForInventory` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetProductsForInventoryData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetProductsForInventoryData {
  products: ({
    id: UUIDString;
    name: string;
    priceCents: number;
    stockCount?: number | null;
    lowStockThreshold?: number | null;
    isActive?: boolean | null;
    createdAt: TimestampString;
  } & Product_Key)[];
}
```
### Using `GetProductsForInventory`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getProductsForInventory, GetProductsForInventoryVariables } from '@bridgeway/database';

// The `GetProductsForInventory` query requires an argument of type `GetProductsForInventoryVariables`:
const getProductsForInventoryVars: GetProductsForInventoryVariables = {
  orgId: ..., 
};

// Call the `getProductsForInventory()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getProductsForInventory(getProductsForInventoryVars);
// Variables can be defined inline as well.
const { data } = await getProductsForInventory({ orgId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getProductsForInventory(dataConnect, getProductsForInventoryVars);

console.log(data.products);

// Or, you can use the `Promise` API.
getProductsForInventory(getProductsForInventoryVars).then((response) => {
  const data = response.data;
  console.log(data.products);
});
```

### Using `GetProductsForInventory`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getProductsForInventoryRef, GetProductsForInventoryVariables } from '@bridgeway/database';

// The `GetProductsForInventory` query requires an argument of type `GetProductsForInventoryVariables`:
const getProductsForInventoryVars: GetProductsForInventoryVariables = {
  orgId: ..., 
};

// Call the `getProductsForInventoryRef()` function to get a reference to the query.
const ref = getProductsForInventoryRef(getProductsForInventoryVars);
// Variables can be defined inline as well.
const ref = getProductsForInventoryRef({ orgId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getProductsForInventoryRef(dataConnect, getProductsForInventoryVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.products);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.products);
});
```

## GetStaffShifts
You can execute the `GetStaffShifts` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
getStaffShifts(vars: GetStaffShiftsVariables, options?: ExecuteQueryOptions): QueryPromise<GetStaffShiftsData, GetStaffShiftsVariables>;

interface GetStaffShiftsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetStaffShiftsVariables): QueryRef<GetStaffShiftsData, GetStaffShiftsVariables>;
}
export const getStaffShiftsRef: GetStaffShiftsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getStaffShifts(dc: DataConnect, vars: GetStaffShiftsVariables, options?: ExecuteQueryOptions): QueryPromise<GetStaffShiftsData, GetStaffShiftsVariables>;

interface GetStaffShiftsRef {
  ...
  (dc: DataConnect, vars: GetStaffShiftsVariables): QueryRef<GetStaffShiftsData, GetStaffShiftsVariables>;
}
export const getStaffShiftsRef: GetStaffShiftsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getStaffShiftsRef:
```typescript
const name = getStaffShiftsRef.operationName;
console.log(name);
```

### Variables
The `GetStaffShifts` query requires an argument of type `GetStaffShiftsVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetStaffShiftsVariables {
  orgId: UUIDString;
  start: DateString;
  end: DateString;
}
```
### Return Type
Recall that executing the `GetStaffShifts` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetStaffShiftsData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetStaffShiftsData {
  staffShifts: ({
    id: UUIDString;
    shiftDate: DateString;
    startTime: string;
    endTime: string;
    notes?: string | null;
    staff: {
      id: UUIDString;
      fullName?: string | null;
    } & Profile_Key;
  } & StaffShift_Key)[];
}
```
### Using `GetStaffShifts`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getStaffShifts, GetStaffShiftsVariables } from '@bridgeway/database';

// The `GetStaffShifts` query requires an argument of type `GetStaffShiftsVariables`:
const getStaffShiftsVars: GetStaffShiftsVariables = {
  orgId: ..., 
  start: ..., 
  end: ..., 
};

// Call the `getStaffShifts()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getStaffShifts(getStaffShiftsVars);
// Variables can be defined inline as well.
const { data } = await getStaffShifts({ orgId: ..., start: ..., end: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getStaffShifts(dataConnect, getStaffShiftsVars);

console.log(data.staffShifts);

// Or, you can use the `Promise` API.
getStaffShifts(getStaffShiftsVars).then((response) => {
  const data = response.data;
  console.log(data.staffShifts);
});
```

### Using `GetStaffShifts`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getStaffShiftsRef, GetStaffShiftsVariables } from '@bridgeway/database';

// The `GetStaffShifts` query requires an argument of type `GetStaffShiftsVariables`:
const getStaffShiftsVars: GetStaffShiftsVariables = {
  orgId: ..., 
  start: ..., 
  end: ..., 
};

// Call the `getStaffShiftsRef()` function to get a reference to the query.
const ref = getStaffShiftsRef(getStaffShiftsVars);
// Variables can be defined inline as well.
const ref = getStaffShiftsRef({ orgId: ..., start: ..., end: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getStaffShiftsRef(dataConnect, getStaffShiftsVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.staffShifts);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.staffShifts);
});
```

## GetUpcomingSlots
You can execute the `GetUpcomingSlots` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
getUpcomingSlots(vars: GetUpcomingSlotsVariables, options?: ExecuteQueryOptions): QueryPromise<GetUpcomingSlotsData, GetUpcomingSlotsVariables>;

interface GetUpcomingSlotsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetUpcomingSlotsVariables): QueryRef<GetUpcomingSlotsData, GetUpcomingSlotsVariables>;
}
export const getUpcomingSlotsRef: GetUpcomingSlotsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getUpcomingSlots(dc: DataConnect, vars: GetUpcomingSlotsVariables, options?: ExecuteQueryOptions): QueryPromise<GetUpcomingSlotsData, GetUpcomingSlotsVariables>;

interface GetUpcomingSlotsRef {
  ...
  (dc: DataConnect, vars: GetUpcomingSlotsVariables): QueryRef<GetUpcomingSlotsData, GetUpcomingSlotsVariables>;
}
export const getUpcomingSlotsRef: GetUpcomingSlotsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getUpcomingSlotsRef:
```typescript
const name = getUpcomingSlotsRef.operationName;
console.log(name);
```

### Variables
The `GetUpcomingSlots` query requires an argument of type `GetUpcomingSlotsVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetUpcomingSlotsVariables {
  orgId: UUIDString;
  now: TimestampString;
}
```
### Return Type
Recall that executing the `GetUpcomingSlots` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetUpcomingSlotsData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetUpcomingSlotsData {
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
### Using `GetUpcomingSlots`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getUpcomingSlots, GetUpcomingSlotsVariables } from '@bridgeway/database';

// The `GetUpcomingSlots` query requires an argument of type `GetUpcomingSlotsVariables`:
const getUpcomingSlotsVars: GetUpcomingSlotsVariables = {
  orgId: ..., 
  now: ..., 
};

// Call the `getUpcomingSlots()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getUpcomingSlots(getUpcomingSlotsVars);
// Variables can be defined inline as well.
const { data } = await getUpcomingSlots({ orgId: ..., now: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getUpcomingSlots(dataConnect, getUpcomingSlotsVars);

console.log(data.slots);

// Or, you can use the `Promise` API.
getUpcomingSlots(getUpcomingSlotsVars).then((response) => {
  const data = response.data;
  console.log(data.slots);
});
```

### Using `GetUpcomingSlots`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getUpcomingSlotsRef, GetUpcomingSlotsVariables } from '@bridgeway/database';

// The `GetUpcomingSlots` query requires an argument of type `GetUpcomingSlotsVariables`:
const getUpcomingSlotsVars: GetUpcomingSlotsVariables = {
  orgId: ..., 
  now: ..., 
};

// Call the `getUpcomingSlotsRef()` function to get a reference to the query.
const ref = getUpcomingSlotsRef(getUpcomingSlotsVars);
// Variables can be defined inline as well.
const ref = getUpcomingSlotsRef({ orgId: ..., now: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getUpcomingSlotsRef(dataConnect, getUpcomingSlotsVars);

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

## GetAvailableSlotsForBooking
You can execute the `GetAvailableSlotsForBooking` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
getAvailableSlotsForBooking(vars: GetAvailableSlotsForBookingVariables, options?: ExecuteQueryOptions): QueryPromise<GetAvailableSlotsForBookingData, GetAvailableSlotsForBookingVariables>;

interface GetAvailableSlotsForBookingRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetAvailableSlotsForBookingVariables): QueryRef<GetAvailableSlotsForBookingData, GetAvailableSlotsForBookingVariables>;
}
export const getAvailableSlotsForBookingRef: GetAvailableSlotsForBookingRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getAvailableSlotsForBooking(dc: DataConnect, vars: GetAvailableSlotsForBookingVariables, options?: ExecuteQueryOptions): QueryPromise<GetAvailableSlotsForBookingData, GetAvailableSlotsForBookingVariables>;

interface GetAvailableSlotsForBookingRef {
  ...
  (dc: DataConnect, vars: GetAvailableSlotsForBookingVariables): QueryRef<GetAvailableSlotsForBookingData, GetAvailableSlotsForBookingVariables>;
}
export const getAvailableSlotsForBookingRef: GetAvailableSlotsForBookingRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getAvailableSlotsForBookingRef:
```typescript
const name = getAvailableSlotsForBookingRef.operationName;
console.log(name);
```

### Variables
The `GetAvailableSlotsForBooking` query requires an argument of type `GetAvailableSlotsForBookingVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetAvailableSlotsForBookingVariables {
  orgId: UUIDString;
  now: TimestampString;
}
```
### Return Type
Recall that executing the `GetAvailableSlotsForBooking` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetAvailableSlotsForBookingData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetAvailableSlotsForBookingData {
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
### Using `GetAvailableSlotsForBooking`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getAvailableSlotsForBooking, GetAvailableSlotsForBookingVariables } from '@bridgeway/database';

// The `GetAvailableSlotsForBooking` query requires an argument of type `GetAvailableSlotsForBookingVariables`:
const getAvailableSlotsForBookingVars: GetAvailableSlotsForBookingVariables = {
  orgId: ..., 
  now: ..., 
};

// Call the `getAvailableSlotsForBooking()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getAvailableSlotsForBooking(getAvailableSlotsForBookingVars);
// Variables can be defined inline as well.
const { data } = await getAvailableSlotsForBooking({ orgId: ..., now: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getAvailableSlotsForBooking(dataConnect, getAvailableSlotsForBookingVars);

console.log(data.slots);

// Or, you can use the `Promise` API.
getAvailableSlotsForBooking(getAvailableSlotsForBookingVars).then((response) => {
  const data = response.data;
  console.log(data.slots);
});
```

### Using `GetAvailableSlotsForBooking`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getAvailableSlotsForBookingRef, GetAvailableSlotsForBookingVariables } from '@bridgeway/database';

// The `GetAvailableSlotsForBooking` query requires an argument of type `GetAvailableSlotsForBookingVariables`:
const getAvailableSlotsForBookingVars: GetAvailableSlotsForBookingVariables = {
  orgId: ..., 
  now: ..., 
};

// Call the `getAvailableSlotsForBookingRef()` function to get a reference to the query.
const ref = getAvailableSlotsForBookingRef(getAvailableSlotsForBookingVars);
// Variables can be defined inline as well.
const ref = getAvailableSlotsForBookingRef({ orgId: ..., now: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getAvailableSlotsForBookingRef(dataConnect, getAvailableSlotsForBookingVars);

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

## GetClasses
You can execute the `GetClasses` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
getClasses(vars: GetClassesVariables, options?: ExecuteQueryOptions): QueryPromise<GetClassesData, GetClassesVariables>;

interface GetClassesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetClassesVariables): QueryRef<GetClassesData, GetClassesVariables>;
}
export const getClassesRef: GetClassesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getClasses(dc: DataConnect, vars: GetClassesVariables, options?: ExecuteQueryOptions): QueryPromise<GetClassesData, GetClassesVariables>;

interface GetClassesRef {
  ...
  (dc: DataConnect, vars: GetClassesVariables): QueryRef<GetClassesData, GetClassesVariables>;
}
export const getClassesRef: GetClassesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getClassesRef:
```typescript
const name = getClassesRef.operationName;
console.log(name);
```

### Variables
The `GetClasses` query requires an argument of type `GetClassesVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetClassesVariables {
  orgId: UUIDString;
}
```
### Return Type
Recall that executing the `GetClasses` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetClassesData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetClassesData {
  classes: ({
    id: UUIDString;
    name: string;
    description?: string | null;
    dayOfWeek: number;
    startTime: string;
    durationMinutes?: number | null;
    capacity?: number | null;
    location?: string | null;
    isActive?: boolean | null;
    instructor?: {
      id: UUIDString;
      fullName?: string | null;
    } & Profile_Key;
  } & Class_Key)[];
}
```
### Using `GetClasses`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getClasses, GetClassesVariables } from '@bridgeway/database';

// The `GetClasses` query requires an argument of type `GetClassesVariables`:
const getClassesVars: GetClassesVariables = {
  orgId: ..., 
};

// Call the `getClasses()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getClasses(getClassesVars);
// Variables can be defined inline as well.
const { data } = await getClasses({ orgId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getClasses(dataConnect, getClassesVars);

console.log(data.classes);

// Or, you can use the `Promise` API.
getClasses(getClassesVars).then((response) => {
  const data = response.data;
  console.log(data.classes);
});
```

### Using `GetClasses`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getClassesRef, GetClassesVariables } from '@bridgeway/database';

// The `GetClasses` query requires an argument of type `GetClassesVariables`:
const getClassesVars: GetClassesVariables = {
  orgId: ..., 
};

// Call the `getClassesRef()` function to get a reference to the query.
const ref = getClassesRef(getClassesVars);
// Variables can be defined inline as well.
const ref = getClassesRef({ orgId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getClassesRef(dataConnect, getClassesVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.classes);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.classes);
});
```

## GetActiveClassesForBooking
You can execute the `GetActiveClassesForBooking` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
getActiveClassesForBooking(vars: GetActiveClassesForBookingVariables, options?: ExecuteQueryOptions): QueryPromise<GetActiveClassesForBookingData, GetActiveClassesForBookingVariables>;

interface GetActiveClassesForBookingRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetActiveClassesForBookingVariables): QueryRef<GetActiveClassesForBookingData, GetActiveClassesForBookingVariables>;
}
export const getActiveClassesForBookingRef: GetActiveClassesForBookingRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getActiveClassesForBooking(dc: DataConnect, vars: GetActiveClassesForBookingVariables, options?: ExecuteQueryOptions): QueryPromise<GetActiveClassesForBookingData, GetActiveClassesForBookingVariables>;

interface GetActiveClassesForBookingRef {
  ...
  (dc: DataConnect, vars: GetActiveClassesForBookingVariables): QueryRef<GetActiveClassesForBookingData, GetActiveClassesForBookingVariables>;
}
export const getActiveClassesForBookingRef: GetActiveClassesForBookingRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getActiveClassesForBookingRef:
```typescript
const name = getActiveClassesForBookingRef.operationName;
console.log(name);
```

### Variables
The `GetActiveClassesForBooking` query requires an argument of type `GetActiveClassesForBookingVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetActiveClassesForBookingVariables {
  orgId: UUIDString;
}
```
### Return Type
Recall that executing the `GetActiveClassesForBooking` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetActiveClassesForBookingData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetActiveClassesForBookingData {
  classes: ({
    id: UUIDString;
    name: string;
    description?: string | null;
    dayOfWeek: number;
    startTime: string;
    durationMinutes?: number | null;
    capacity?: number | null;
    location?: string | null;
    instructor?: {
      id: UUIDString;
      fullName?: string | null;
    } & Profile_Key;
  } & Class_Key)[];
}
```
### Using `GetActiveClassesForBooking`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getActiveClassesForBooking, GetActiveClassesForBookingVariables } from '@bridgeway/database';

// The `GetActiveClassesForBooking` query requires an argument of type `GetActiveClassesForBookingVariables`:
const getActiveClassesForBookingVars: GetActiveClassesForBookingVariables = {
  orgId: ..., 
};

// Call the `getActiveClassesForBooking()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getActiveClassesForBooking(getActiveClassesForBookingVars);
// Variables can be defined inline as well.
const { data } = await getActiveClassesForBooking({ orgId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getActiveClassesForBooking(dataConnect, getActiveClassesForBookingVars);

console.log(data.classes);

// Or, you can use the `Promise` API.
getActiveClassesForBooking(getActiveClassesForBookingVars).then((response) => {
  const data = response.data;
  console.log(data.classes);
});
```

### Using `GetActiveClassesForBooking`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getActiveClassesForBookingRef, GetActiveClassesForBookingVariables } from '@bridgeway/database';

// The `GetActiveClassesForBooking` query requires an argument of type `GetActiveClassesForBookingVariables`:
const getActiveClassesForBookingVars: GetActiveClassesForBookingVariables = {
  orgId: ..., 
};

// Call the `getActiveClassesForBookingRef()` function to get a reference to the query.
const ref = getActiveClassesForBookingRef(getActiveClassesForBookingVars);
// Variables can be defined inline as well.
const ref = getActiveClassesForBookingRef({ orgId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getActiveClassesForBookingRef(dataConnect, getActiveClassesForBookingVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.classes);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.classes);
});
```

## GetClassRegistrationsForReports
You can execute the `GetClassRegistrationsForReports` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
getClassRegistrationsForReports(vars: GetClassRegistrationsForReportsVariables, options?: ExecuteQueryOptions): QueryPromise<GetClassRegistrationsForReportsData, GetClassRegistrationsForReportsVariables>;

interface GetClassRegistrationsForReportsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetClassRegistrationsForReportsVariables): QueryRef<GetClassRegistrationsForReportsData, GetClassRegistrationsForReportsVariables>;
}
export const getClassRegistrationsForReportsRef: GetClassRegistrationsForReportsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getClassRegistrationsForReports(dc: DataConnect, vars: GetClassRegistrationsForReportsVariables, options?: ExecuteQueryOptions): QueryPromise<GetClassRegistrationsForReportsData, GetClassRegistrationsForReportsVariables>;

interface GetClassRegistrationsForReportsRef {
  ...
  (dc: DataConnect, vars: GetClassRegistrationsForReportsVariables): QueryRef<GetClassRegistrationsForReportsData, GetClassRegistrationsForReportsVariables>;
}
export const getClassRegistrationsForReportsRef: GetClassRegistrationsForReportsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getClassRegistrationsForReportsRef:
```typescript
const name = getClassRegistrationsForReportsRef.operationName;
console.log(name);
```

### Variables
The `GetClassRegistrationsForReports` query requires an argument of type `GetClassRegistrationsForReportsVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetClassRegistrationsForReportsVariables {
  orgId: UUIDString;
  since: TimestampString;
}
```
### Return Type
Recall that executing the `GetClassRegistrationsForReports` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetClassRegistrationsForReportsData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetClassRegistrationsForReportsData {
  classRegistrations: ({
    createdAt: TimestampString;
    classEntity: {
      name: string;
      capacity?: number | null;
    };
  })[];
}
```
### Using `GetClassRegistrationsForReports`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getClassRegistrationsForReports, GetClassRegistrationsForReportsVariables } from '@bridgeway/database';

// The `GetClassRegistrationsForReports` query requires an argument of type `GetClassRegistrationsForReportsVariables`:
const getClassRegistrationsForReportsVars: GetClassRegistrationsForReportsVariables = {
  orgId: ..., 
  since: ..., 
};

// Call the `getClassRegistrationsForReports()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getClassRegistrationsForReports(getClassRegistrationsForReportsVars);
// Variables can be defined inline as well.
const { data } = await getClassRegistrationsForReports({ orgId: ..., since: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getClassRegistrationsForReports(dataConnect, getClassRegistrationsForReportsVars);

console.log(data.classRegistrations);

// Or, you can use the `Promise` API.
getClassRegistrationsForReports(getClassRegistrationsForReportsVars).then((response) => {
  const data = response.data;
  console.log(data.classRegistrations);
});
```

### Using `GetClassRegistrationsForReports`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getClassRegistrationsForReportsRef, GetClassRegistrationsForReportsVariables } from '@bridgeway/database';

// The `GetClassRegistrationsForReports` query requires an argument of type `GetClassRegistrationsForReportsVariables`:
const getClassRegistrationsForReportsVars: GetClassRegistrationsForReportsVariables = {
  orgId: ..., 
  since: ..., 
};

// Call the `getClassRegistrationsForReportsRef()` function to get a reference to the query.
const ref = getClassRegistrationsForReportsRef(getClassRegistrationsForReportsVars);
// Variables can be defined inline as well.
const ref = getClassRegistrationsForReportsRef({ orgId: ..., since: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getClassRegistrationsForReportsRef(dataConnect, getClassRegistrationsForReportsVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.classRegistrations);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.classRegistrations);
});
```

## GetClassesForReports
You can execute the `GetClassesForReports` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
getClassesForReports(vars: GetClassesForReportsVariables, options?: ExecuteQueryOptions): QueryPromise<GetClassesForReportsData, GetClassesForReportsVariables>;

interface GetClassesForReportsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetClassesForReportsVariables): QueryRef<GetClassesForReportsData, GetClassesForReportsVariables>;
}
export const getClassesForReportsRef: GetClassesForReportsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getClassesForReports(dc: DataConnect, vars: GetClassesForReportsVariables, options?: ExecuteQueryOptions): QueryPromise<GetClassesForReportsData, GetClassesForReportsVariables>;

interface GetClassesForReportsRef {
  ...
  (dc: DataConnect, vars: GetClassesForReportsVariables): QueryRef<GetClassesForReportsData, GetClassesForReportsVariables>;
}
export const getClassesForReportsRef: GetClassesForReportsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getClassesForReportsRef:
```typescript
const name = getClassesForReportsRef.operationName;
console.log(name);
```

### Variables
The `GetClassesForReports` query requires an argument of type `GetClassesForReportsVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetClassesForReportsVariables {
  orgId: UUIDString;
}
```
### Return Type
Recall that executing the `GetClassesForReports` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetClassesForReportsData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetClassesForReportsData {
  classes: ({
    id: UUIDString;
    name: string;
    capacity?: number | null;
  } & Class_Key)[];
}
```
### Using `GetClassesForReports`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getClassesForReports, GetClassesForReportsVariables } from '@bridgeway/database';

// The `GetClassesForReports` query requires an argument of type `GetClassesForReportsVariables`:
const getClassesForReportsVars: GetClassesForReportsVariables = {
  orgId: ..., 
};

// Call the `getClassesForReports()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getClassesForReports(getClassesForReportsVars);
// Variables can be defined inline as well.
const { data } = await getClassesForReports({ orgId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getClassesForReports(dataConnect, getClassesForReportsVars);

console.log(data.classes);

// Or, you can use the `Promise` API.
getClassesForReports(getClassesForReportsVars).then((response) => {
  const data = response.data;
  console.log(data.classes);
});
```

### Using `GetClassesForReports`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getClassesForReportsRef, GetClassesForReportsVariables } from '@bridgeway/database';

// The `GetClassesForReports` query requires an argument of type `GetClassesForReportsVariables`:
const getClassesForReportsVars: GetClassesForReportsVariables = {
  orgId: ..., 
};

// Call the `getClassesForReportsRef()` function to get a reference to the query.
const ref = getClassesForReportsRef(getClassesForReportsVars);
// Variables can be defined inline as well.
const ref = getClassesForReportsRef({ orgId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getClassesForReportsRef(dataConnect, getClassesForReportsVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.classes);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.classes);
});
```

## GetExistingRegistration
You can execute the `GetExistingRegistration` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
getExistingRegistration(vars: GetExistingRegistrationVariables, options?: ExecuteQueryOptions): QueryPromise<GetExistingRegistrationData, GetExistingRegistrationVariables>;

interface GetExistingRegistrationRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetExistingRegistrationVariables): QueryRef<GetExistingRegistrationData, GetExistingRegistrationVariables>;
}
export const getExistingRegistrationRef: GetExistingRegistrationRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getExistingRegistration(dc: DataConnect, vars: GetExistingRegistrationVariables, options?: ExecuteQueryOptions): QueryPromise<GetExistingRegistrationData, GetExistingRegistrationVariables>;

interface GetExistingRegistrationRef {
  ...
  (dc: DataConnect, vars: GetExistingRegistrationVariables): QueryRef<GetExistingRegistrationData, GetExistingRegistrationVariables>;
}
export const getExistingRegistrationRef: GetExistingRegistrationRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getExistingRegistrationRef:
```typescript
const name = getExistingRegistrationRef.operationName;
console.log(name);
```

### Variables
The `GetExistingRegistration` query requires an argument of type `GetExistingRegistrationVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetExistingRegistrationVariables {
  classId: UUIDString;
  clientId: UUIDString;
  classDate: DateString;
}
```
### Return Type
Recall that executing the `GetExistingRegistration` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetExistingRegistrationData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetExistingRegistrationData {
  classRegistrations: ({
    id: UUIDString;
    status: string;
  } & ClassRegistration_Key)[];
}
```
### Using `GetExistingRegistration`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getExistingRegistration, GetExistingRegistrationVariables } from '@bridgeway/database';

// The `GetExistingRegistration` query requires an argument of type `GetExistingRegistrationVariables`:
const getExistingRegistrationVars: GetExistingRegistrationVariables = {
  classId: ..., 
  clientId: ..., 
  classDate: ..., 
};

// Call the `getExistingRegistration()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getExistingRegistration(getExistingRegistrationVars);
// Variables can be defined inline as well.
const { data } = await getExistingRegistration({ classId: ..., clientId: ..., classDate: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getExistingRegistration(dataConnect, getExistingRegistrationVars);

console.log(data.classRegistrations);

// Or, you can use the `Promise` API.
getExistingRegistration(getExistingRegistrationVars).then((response) => {
  const data = response.data;
  console.log(data.classRegistrations);
});
```

### Using `GetExistingRegistration`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getExistingRegistrationRef, GetExistingRegistrationVariables } from '@bridgeway/database';

// The `GetExistingRegistration` query requires an argument of type `GetExistingRegistrationVariables`:
const getExistingRegistrationVars: GetExistingRegistrationVariables = {
  classId: ..., 
  clientId: ..., 
  classDate: ..., 
};

// Call the `getExistingRegistrationRef()` function to get a reference to the query.
const ref = getExistingRegistrationRef(getExistingRegistrationVars);
// Variables can be defined inline as well.
const ref = getExistingRegistrationRef({ classId: ..., clientId: ..., classDate: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getExistingRegistrationRef(dataConnect, getExistingRegistrationVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.classRegistrations);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.classRegistrations);
});
```

## GetClassRegistrationsCount
You can execute the `GetClassRegistrationsCount` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
getClassRegistrationsCount(vars: GetClassRegistrationsCountVariables, options?: ExecuteQueryOptions): QueryPromise<GetClassRegistrationsCountData, GetClassRegistrationsCountVariables>;

interface GetClassRegistrationsCountRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetClassRegistrationsCountVariables): QueryRef<GetClassRegistrationsCountData, GetClassRegistrationsCountVariables>;
}
export const getClassRegistrationsCountRef: GetClassRegistrationsCountRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getClassRegistrationsCount(dc: DataConnect, vars: GetClassRegistrationsCountVariables, options?: ExecuteQueryOptions): QueryPromise<GetClassRegistrationsCountData, GetClassRegistrationsCountVariables>;

interface GetClassRegistrationsCountRef {
  ...
  (dc: DataConnect, vars: GetClassRegistrationsCountVariables): QueryRef<GetClassRegistrationsCountData, GetClassRegistrationsCountVariables>;
}
export const getClassRegistrationsCountRef: GetClassRegistrationsCountRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getClassRegistrationsCountRef:
```typescript
const name = getClassRegistrationsCountRef.operationName;
console.log(name);
```

### Variables
The `GetClassRegistrationsCount` query requires an argument of type `GetClassRegistrationsCountVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetClassRegistrationsCountVariables {
  classId: UUIDString;
  classDate: DateString;
}
```
### Return Type
Recall that executing the `GetClassRegistrationsCount` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetClassRegistrationsCountData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetClassRegistrationsCountData {
  classRegistrations: ({
    id: UUIDString;
  } & ClassRegistration_Key)[];
}
```
### Using `GetClassRegistrationsCount`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getClassRegistrationsCount, GetClassRegistrationsCountVariables } from '@bridgeway/database';

// The `GetClassRegistrationsCount` query requires an argument of type `GetClassRegistrationsCountVariables`:
const getClassRegistrationsCountVars: GetClassRegistrationsCountVariables = {
  classId: ..., 
  classDate: ..., 
};

// Call the `getClassRegistrationsCount()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getClassRegistrationsCount(getClassRegistrationsCountVars);
// Variables can be defined inline as well.
const { data } = await getClassRegistrationsCount({ classId: ..., classDate: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getClassRegistrationsCount(dataConnect, getClassRegistrationsCountVars);

console.log(data.classRegistrations);

// Or, you can use the `Promise` API.
getClassRegistrationsCount(getClassRegistrationsCountVars).then((response) => {
  const data = response.data;
  console.log(data.classRegistrations);
});
```

### Using `GetClassRegistrationsCount`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getClassRegistrationsCountRef, GetClassRegistrationsCountVariables } from '@bridgeway/database';

// The `GetClassRegistrationsCount` query requires an argument of type `GetClassRegistrationsCountVariables`:
const getClassRegistrationsCountVars: GetClassRegistrationsCountVariables = {
  classId: ..., 
  classDate: ..., 
};

// Call the `getClassRegistrationsCountRef()` function to get a reference to the query.
const ref = getClassRegistrationsCountRef(getClassRegistrationsCountVars);
// Variables can be defined inline as well.
const ref = getClassRegistrationsCountRef({ classId: ..., classDate: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getClassRegistrationsCountRef(dataConnect, getClassRegistrationsCountVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.classRegistrations);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.classRegistrations);
});
```

## GetWidgetConfig
You can execute the `GetWidgetConfig` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
getWidgetConfig(vars: GetWidgetConfigVariables, options?: ExecuteQueryOptions): QueryPromise<GetWidgetConfigData, GetWidgetConfigVariables>;

interface GetWidgetConfigRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetWidgetConfigVariables): QueryRef<GetWidgetConfigData, GetWidgetConfigVariables>;
}
export const getWidgetConfigRef: GetWidgetConfigRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getWidgetConfig(dc: DataConnect, vars: GetWidgetConfigVariables, options?: ExecuteQueryOptions): QueryPromise<GetWidgetConfigData, GetWidgetConfigVariables>;

interface GetWidgetConfigRef {
  ...
  (dc: DataConnect, vars: GetWidgetConfigVariables): QueryRef<GetWidgetConfigData, GetWidgetConfigVariables>;
}
export const getWidgetConfigRef: GetWidgetConfigRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getWidgetConfigRef:
```typescript
const name = getWidgetConfigRef.operationName;
console.log(name);
```

### Variables
The `GetWidgetConfig` query requires an argument of type `GetWidgetConfigVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetWidgetConfigVariables {
  userId: string;
}
```
### Return Type
Recall that executing the `GetWidgetConfig` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetWidgetConfigData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetWidgetConfigData {
  widgetConfigs: ({
    config: unknown;
  })[];
}
```
### Using `GetWidgetConfig`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getWidgetConfig, GetWidgetConfigVariables } from '@bridgeway/database';

// The `GetWidgetConfig` query requires an argument of type `GetWidgetConfigVariables`:
const getWidgetConfigVars: GetWidgetConfigVariables = {
  userId: ..., 
};

// Call the `getWidgetConfig()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getWidgetConfig(getWidgetConfigVars);
// Variables can be defined inline as well.
const { data } = await getWidgetConfig({ userId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getWidgetConfig(dataConnect, getWidgetConfigVars);

console.log(data.widgetConfigs);

// Or, you can use the `Promise` API.
getWidgetConfig(getWidgetConfigVars).then((response) => {
  const data = response.data;
  console.log(data.widgetConfigs);
});
```

### Using `GetWidgetConfig`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getWidgetConfigRef, GetWidgetConfigVariables } from '@bridgeway/database';

// The `GetWidgetConfig` query requires an argument of type `GetWidgetConfigVariables`:
const getWidgetConfigVars: GetWidgetConfigVariables = {
  userId: ..., 
};

// Call the `getWidgetConfigRef()` function to get a reference to the query.
const ref = getWidgetConfigRef(getWidgetConfigVars);
// Variables can be defined inline as well.
const ref = getWidgetConfigRef({ userId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getWidgetConfigRef(dataConnect, getWidgetConfigVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.widgetConfigs);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.widgetConfigs);
});
```

## GetAppointmentsForReports
You can execute the `GetAppointmentsForReports` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
getAppointmentsForReports(vars: GetAppointmentsForReportsVariables, options?: ExecuteQueryOptions): QueryPromise<GetAppointmentsForReportsData, GetAppointmentsForReportsVariables>;

interface GetAppointmentsForReportsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetAppointmentsForReportsVariables): QueryRef<GetAppointmentsForReportsData, GetAppointmentsForReportsVariables>;
}
export const getAppointmentsForReportsRef: GetAppointmentsForReportsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getAppointmentsForReports(dc: DataConnect, vars: GetAppointmentsForReportsVariables, options?: ExecuteQueryOptions): QueryPromise<GetAppointmentsForReportsData, GetAppointmentsForReportsVariables>;

interface GetAppointmentsForReportsRef {
  ...
  (dc: DataConnect, vars: GetAppointmentsForReportsVariables): QueryRef<GetAppointmentsForReportsData, GetAppointmentsForReportsVariables>;
}
export const getAppointmentsForReportsRef: GetAppointmentsForReportsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getAppointmentsForReportsRef:
```typescript
const name = getAppointmentsForReportsRef.operationName;
console.log(name);
```

### Variables
The `GetAppointmentsForReports` query requires an argument of type `GetAppointmentsForReportsVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetAppointmentsForReportsVariables {
  orgId: UUIDString;
  since: TimestampString;
}
```
### Return Type
Recall that executing the `GetAppointmentsForReports` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetAppointmentsForReportsData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetAppointmentsForReportsData {
  appointments: ({
    id: UUIDString;
    scheduledAt: TimestampString;
    status: string;
    amount?: number | null;
    client?: {
      id: UUIDString;
    } & Client_Key;
    service?: {
      id: UUIDString;
      name: string;
    } & Service_Key;
    staff?: {
      id: UUIDString;
      fullName?: string | null;
    } & Profile_Key;
  } & Appointment_Key)[];
}
```
### Using `GetAppointmentsForReports`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getAppointmentsForReports, GetAppointmentsForReportsVariables } from '@bridgeway/database';

// The `GetAppointmentsForReports` query requires an argument of type `GetAppointmentsForReportsVariables`:
const getAppointmentsForReportsVars: GetAppointmentsForReportsVariables = {
  orgId: ..., 
  since: ..., 
};

// Call the `getAppointmentsForReports()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getAppointmentsForReports(getAppointmentsForReportsVars);
// Variables can be defined inline as well.
const { data } = await getAppointmentsForReports({ orgId: ..., since: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getAppointmentsForReports(dataConnect, getAppointmentsForReportsVars);

console.log(data.appointments);

// Or, you can use the `Promise` API.
getAppointmentsForReports(getAppointmentsForReportsVars).then((response) => {
  const data = response.data;
  console.log(data.appointments);
});
```

### Using `GetAppointmentsForReports`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getAppointmentsForReportsRef, GetAppointmentsForReportsVariables } from '@bridgeway/database';

// The `GetAppointmentsForReports` query requires an argument of type `GetAppointmentsForReportsVariables`:
const getAppointmentsForReportsVars: GetAppointmentsForReportsVariables = {
  orgId: ..., 
  since: ..., 
};

// Call the `getAppointmentsForReportsRef()` function to get a reference to the query.
const ref = getAppointmentsForReportsRef(getAppointmentsForReportsVars);
// Variables can be defined inline as well.
const ref = getAppointmentsForReportsRef({ orgId: ..., since: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getAppointmentsForReportsRef(dataConnect, getAppointmentsForReportsVars);

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

## GetClientsForReports
You can execute the `GetClientsForReports` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
getClientsForReports(vars: GetClientsForReportsVariables, options?: ExecuteQueryOptions): QueryPromise<GetClientsForReportsData, GetClientsForReportsVariables>;

interface GetClientsForReportsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetClientsForReportsVariables): QueryRef<GetClientsForReportsData, GetClientsForReportsVariables>;
}
export const getClientsForReportsRef: GetClientsForReportsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getClientsForReports(dc: DataConnect, vars: GetClientsForReportsVariables, options?: ExecuteQueryOptions): QueryPromise<GetClientsForReportsData, GetClientsForReportsVariables>;

interface GetClientsForReportsRef {
  ...
  (dc: DataConnect, vars: GetClientsForReportsVariables): QueryRef<GetClientsForReportsData, GetClientsForReportsVariables>;
}
export const getClientsForReportsRef: GetClientsForReportsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getClientsForReportsRef:
```typescript
const name = getClientsForReportsRef.operationName;
console.log(name);
```

### Variables
The `GetClientsForReports` query requires an argument of type `GetClientsForReportsVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetClientsForReportsVariables {
  orgId: UUIDString;
}
```
### Return Type
Recall that executing the `GetClientsForReports` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetClientsForReportsData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetClientsForReportsData {
  clients: ({
    id: UUIDString;
    name: string;
    email?: string | null;
    phone?: string | null;
    createdAt: TimestampString;
  } & Client_Key)[];
}
```
### Using `GetClientsForReports`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getClientsForReports, GetClientsForReportsVariables } from '@bridgeway/database';

// The `GetClientsForReports` query requires an argument of type `GetClientsForReportsVariables`:
const getClientsForReportsVars: GetClientsForReportsVariables = {
  orgId: ..., 
};

// Call the `getClientsForReports()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getClientsForReports(getClientsForReportsVars);
// Variables can be defined inline as well.
const { data } = await getClientsForReports({ orgId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getClientsForReports(dataConnect, getClientsForReportsVars);

console.log(data.clients);

// Or, you can use the `Promise` API.
getClientsForReports(getClientsForReportsVars).then((response) => {
  const data = response.data;
  console.log(data.clients);
});
```

### Using `GetClientsForReports`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getClientsForReportsRef, GetClientsForReportsVariables } from '@bridgeway/database';

// The `GetClientsForReports` query requires an argument of type `GetClientsForReportsVariables`:
const getClientsForReportsVars: GetClientsForReportsVariables = {
  orgId: ..., 
};

// Call the `getClientsForReportsRef()` function to get a reference to the query.
const ref = getClientsForReportsRef(getClientsForReportsVars);
// Variables can be defined inline as well.
const ref = getClientsForReportsRef({ orgId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getClientsForReportsRef(dataConnect, getClientsForReportsVars);

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

## GetActiveIntakeTemplates
You can execute the `GetActiveIntakeTemplates` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
getActiveIntakeTemplates(vars: GetActiveIntakeTemplatesVariables, options?: ExecuteQueryOptions): QueryPromise<GetActiveIntakeTemplatesData, GetActiveIntakeTemplatesVariables>;

interface GetActiveIntakeTemplatesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetActiveIntakeTemplatesVariables): QueryRef<GetActiveIntakeTemplatesData, GetActiveIntakeTemplatesVariables>;
}
export const getActiveIntakeTemplatesRef: GetActiveIntakeTemplatesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getActiveIntakeTemplates(dc: DataConnect, vars: GetActiveIntakeTemplatesVariables, options?: ExecuteQueryOptions): QueryPromise<GetActiveIntakeTemplatesData, GetActiveIntakeTemplatesVariables>;

interface GetActiveIntakeTemplatesRef {
  ...
  (dc: DataConnect, vars: GetActiveIntakeTemplatesVariables): QueryRef<GetActiveIntakeTemplatesData, GetActiveIntakeTemplatesVariables>;
}
export const getActiveIntakeTemplatesRef: GetActiveIntakeTemplatesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getActiveIntakeTemplatesRef:
```typescript
const name = getActiveIntakeTemplatesRef.operationName;
console.log(name);
```

### Variables
The `GetActiveIntakeTemplates` query requires an argument of type `GetActiveIntakeTemplatesVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetActiveIntakeTemplatesVariables {
  orgId: UUIDString;
}
```
### Return Type
Recall that executing the `GetActiveIntakeTemplates` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetActiveIntakeTemplatesData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetActiveIntakeTemplatesData {
  intakeFormTemplates: ({
    id: UUIDString;
    name: string;
    fields: unknown;
  } & IntakeFormTemplate_Key)[];
}
```
### Using `GetActiveIntakeTemplates`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getActiveIntakeTemplates, GetActiveIntakeTemplatesVariables } from '@bridgeway/database';

// The `GetActiveIntakeTemplates` query requires an argument of type `GetActiveIntakeTemplatesVariables`:
const getActiveIntakeTemplatesVars: GetActiveIntakeTemplatesVariables = {
  orgId: ..., 
};

// Call the `getActiveIntakeTemplates()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getActiveIntakeTemplates(getActiveIntakeTemplatesVars);
// Variables can be defined inline as well.
const { data } = await getActiveIntakeTemplates({ orgId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getActiveIntakeTemplates(dataConnect, getActiveIntakeTemplatesVars);

console.log(data.intakeFormTemplates);

// Or, you can use the `Promise` API.
getActiveIntakeTemplates(getActiveIntakeTemplatesVars).then((response) => {
  const data = response.data;
  console.log(data.intakeFormTemplates);
});
```

### Using `GetActiveIntakeTemplates`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getActiveIntakeTemplatesRef, GetActiveIntakeTemplatesVariables } from '@bridgeway/database';

// The `GetActiveIntakeTemplates` query requires an argument of type `GetActiveIntakeTemplatesVariables`:
const getActiveIntakeTemplatesVars: GetActiveIntakeTemplatesVariables = {
  orgId: ..., 
};

// Call the `getActiveIntakeTemplatesRef()` function to get a reference to the query.
const ref = getActiveIntakeTemplatesRef(getActiveIntakeTemplatesVars);
// Variables can be defined inline as well.
const ref = getActiveIntakeTemplatesRef({ orgId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getActiveIntakeTemplatesRef(dataConnect, getActiveIntakeTemplatesVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.intakeFormTemplates);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.intakeFormTemplates);
});
```

## GetIntakeSubmissions
You can execute the `GetIntakeSubmissions` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
getIntakeSubmissions(vars: GetIntakeSubmissionsVariables, options?: ExecuteQueryOptions): QueryPromise<GetIntakeSubmissionsData, GetIntakeSubmissionsVariables>;

interface GetIntakeSubmissionsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetIntakeSubmissionsVariables): QueryRef<GetIntakeSubmissionsData, GetIntakeSubmissionsVariables>;
}
export const getIntakeSubmissionsRef: GetIntakeSubmissionsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getIntakeSubmissions(dc: DataConnect, vars: GetIntakeSubmissionsVariables, options?: ExecuteQueryOptions): QueryPromise<GetIntakeSubmissionsData, GetIntakeSubmissionsVariables>;

interface GetIntakeSubmissionsRef {
  ...
  (dc: DataConnect, vars: GetIntakeSubmissionsVariables): QueryRef<GetIntakeSubmissionsData, GetIntakeSubmissionsVariables>;
}
export const getIntakeSubmissionsRef: GetIntakeSubmissionsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getIntakeSubmissionsRef:
```typescript
const name = getIntakeSubmissionsRef.operationName;
console.log(name);
```

### Variables
The `GetIntakeSubmissions` query requires an argument of type `GetIntakeSubmissionsVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetIntakeSubmissionsVariables {
  orgId: UUIDString;
  clientId: UUIDString;
}
```
### Return Type
Recall that executing the `GetIntakeSubmissions` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetIntakeSubmissionsData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetIntakeSubmissionsData {
  intakeFormSubmissions: ({
    form: {
      id: UUIDString;
    } & IntakeFormTemplate_Key;
    appointment?: {
      id: UUIDString;
    } & Appointment_Key;
  })[];
}
```
### Using `GetIntakeSubmissions`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getIntakeSubmissions, GetIntakeSubmissionsVariables } from '@bridgeway/database';

// The `GetIntakeSubmissions` query requires an argument of type `GetIntakeSubmissionsVariables`:
const getIntakeSubmissionsVars: GetIntakeSubmissionsVariables = {
  orgId: ..., 
  clientId: ..., 
};

// Call the `getIntakeSubmissions()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getIntakeSubmissions(getIntakeSubmissionsVars);
// Variables can be defined inline as well.
const { data } = await getIntakeSubmissions({ orgId: ..., clientId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getIntakeSubmissions(dataConnect, getIntakeSubmissionsVars);

console.log(data.intakeFormSubmissions);

// Or, you can use the `Promise` API.
getIntakeSubmissions(getIntakeSubmissionsVars).then((response) => {
  const data = response.data;
  console.log(data.intakeFormSubmissions);
});
```

### Using `GetIntakeSubmissions`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getIntakeSubmissionsRef, GetIntakeSubmissionsVariables } from '@bridgeway/database';

// The `GetIntakeSubmissions` query requires an argument of type `GetIntakeSubmissionsVariables`:
const getIntakeSubmissionsVars: GetIntakeSubmissionsVariables = {
  orgId: ..., 
  clientId: ..., 
};

// Call the `getIntakeSubmissionsRef()` function to get a reference to the query.
const ref = getIntakeSubmissionsRef(getIntakeSubmissionsVars);
// Variables can be defined inline as well.
const ref = getIntakeSubmissionsRef({ orgId: ..., clientId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getIntakeSubmissionsRef(dataConnect, getIntakeSubmissionsVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.intakeFormSubmissions);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.intakeFormSubmissions);
});
```

## GetClientDocuments
You can execute the `GetClientDocuments` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
getClientDocuments(vars: GetClientDocumentsVariables, options?: ExecuteQueryOptions): QueryPromise<GetClientDocumentsData, GetClientDocumentsVariables>;

interface GetClientDocumentsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetClientDocumentsVariables): QueryRef<GetClientDocumentsData, GetClientDocumentsVariables>;
}
export const getClientDocumentsRef: GetClientDocumentsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getClientDocuments(dc: DataConnect, vars: GetClientDocumentsVariables, options?: ExecuteQueryOptions): QueryPromise<GetClientDocumentsData, GetClientDocumentsVariables>;

interface GetClientDocumentsRef {
  ...
  (dc: DataConnect, vars: GetClientDocumentsVariables): QueryRef<GetClientDocumentsData, GetClientDocumentsVariables>;
}
export const getClientDocumentsRef: GetClientDocumentsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getClientDocumentsRef:
```typescript
const name = getClientDocumentsRef.operationName;
console.log(name);
```

### Variables
The `GetClientDocuments` query requires an argument of type `GetClientDocumentsVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetClientDocumentsVariables {
  orgId: UUIDString;
  clientId: UUIDString;
}
```
### Return Type
Recall that executing the `GetClientDocuments` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetClientDocumentsData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetClientDocumentsData {
  documents: ({
    id: UUIDString;
    title: string;
    fileUrl: string;
    createdAt: TimestampString;
  } & Document_Key)[];
}
```
### Using `GetClientDocuments`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getClientDocuments, GetClientDocumentsVariables } from '@bridgeway/database';

// The `GetClientDocuments` query requires an argument of type `GetClientDocumentsVariables`:
const getClientDocumentsVars: GetClientDocumentsVariables = {
  orgId: ..., 
  clientId: ..., 
};

// Call the `getClientDocuments()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getClientDocuments(getClientDocumentsVars);
// Variables can be defined inline as well.
const { data } = await getClientDocuments({ orgId: ..., clientId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getClientDocuments(dataConnect, getClientDocumentsVars);

console.log(data.documents);

// Or, you can use the `Promise` API.
getClientDocuments(getClientDocumentsVars).then((response) => {
  const data = response.data;
  console.log(data.documents);
});
```

### Using `GetClientDocuments`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getClientDocumentsRef, GetClientDocumentsVariables } from '@bridgeway/database';

// The `GetClientDocuments` query requires an argument of type `GetClientDocumentsVariables`:
const getClientDocumentsVars: GetClientDocumentsVariables = {
  orgId: ..., 
  clientId: ..., 
};

// Call the `getClientDocumentsRef()` function to get a reference to the query.
const ref = getClientDocumentsRef(getClientDocumentsVars);
// Variables can be defined inline as well.
const ref = getClientDocumentsRef({ orgId: ..., clientId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getClientDocumentsRef(dataConnect, getClientDocumentsVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.documents);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.documents);
});
```

## GetAnnouncements
You can execute the `GetAnnouncements` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
getAnnouncements(vars: GetAnnouncementsVariables, options?: ExecuteQueryOptions): QueryPromise<GetAnnouncementsData, GetAnnouncementsVariables>;

interface GetAnnouncementsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetAnnouncementsVariables): QueryRef<GetAnnouncementsData, GetAnnouncementsVariables>;
}
export const getAnnouncementsRef: GetAnnouncementsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getAnnouncements(dc: DataConnect, vars: GetAnnouncementsVariables, options?: ExecuteQueryOptions): QueryPromise<GetAnnouncementsData, GetAnnouncementsVariables>;

interface GetAnnouncementsRef {
  ...
  (dc: DataConnect, vars: GetAnnouncementsVariables): QueryRef<GetAnnouncementsData, GetAnnouncementsVariables>;
}
export const getAnnouncementsRef: GetAnnouncementsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getAnnouncementsRef:
```typescript
const name = getAnnouncementsRef.operationName;
console.log(name);
```

### Variables
The `GetAnnouncements` query requires an argument of type `GetAnnouncementsVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetAnnouncementsVariables {
  orgId: UUIDString;
}
```
### Return Type
Recall that executing the `GetAnnouncements` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetAnnouncementsData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetAnnouncementsData {
  announcements: ({
    id: UUIDString;
    message: string;
    postedAt: TimestampString;
    postedBy?: {
      id: UUIDString;
      fullName?: string | null;
    } & Profile_Key;
  } & Announcement_Key)[];
}
```
### Using `GetAnnouncements`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getAnnouncements, GetAnnouncementsVariables } from '@bridgeway/database';

// The `GetAnnouncements` query requires an argument of type `GetAnnouncementsVariables`:
const getAnnouncementsVars: GetAnnouncementsVariables = {
  orgId: ..., 
};

// Call the `getAnnouncements()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getAnnouncements(getAnnouncementsVars);
// Variables can be defined inline as well.
const { data } = await getAnnouncements({ orgId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getAnnouncements(dataConnect, getAnnouncementsVars);

console.log(data.announcements);

// Or, you can use the `Promise` API.
getAnnouncements(getAnnouncementsVars).then((response) => {
  const data = response.data;
  console.log(data.announcements);
});
```

### Using `GetAnnouncements`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getAnnouncementsRef, GetAnnouncementsVariables } from '@bridgeway/database';

// The `GetAnnouncements` query requires an argument of type `GetAnnouncementsVariables`:
const getAnnouncementsVars: GetAnnouncementsVariables = {
  orgId: ..., 
};

// Call the `getAnnouncementsRef()` function to get a reference to the query.
const ref = getAnnouncementsRef(getAnnouncementsVars);
// Variables can be defined inline as well.
const ref = getAnnouncementsRef({ orgId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getAnnouncementsRef(dataConnect, getAnnouncementsVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.announcements);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.announcements);
});
```

## GetClassRegistrationsForAttendance
You can execute the `GetClassRegistrationsForAttendance` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
getClassRegistrationsForAttendance(vars: GetClassRegistrationsForAttendanceVariables, options?: ExecuteQueryOptions): QueryPromise<GetClassRegistrationsForAttendanceData, GetClassRegistrationsForAttendanceVariables>;

interface GetClassRegistrationsForAttendanceRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetClassRegistrationsForAttendanceVariables): QueryRef<GetClassRegistrationsForAttendanceData, GetClassRegistrationsForAttendanceVariables>;
}
export const getClassRegistrationsForAttendanceRef: GetClassRegistrationsForAttendanceRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getClassRegistrationsForAttendance(dc: DataConnect, vars: GetClassRegistrationsForAttendanceVariables, options?: ExecuteQueryOptions): QueryPromise<GetClassRegistrationsForAttendanceData, GetClassRegistrationsForAttendanceVariables>;

interface GetClassRegistrationsForAttendanceRef {
  ...
  (dc: DataConnect, vars: GetClassRegistrationsForAttendanceVariables): QueryRef<GetClassRegistrationsForAttendanceData, GetClassRegistrationsForAttendanceVariables>;
}
export const getClassRegistrationsForAttendanceRef: GetClassRegistrationsForAttendanceRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getClassRegistrationsForAttendanceRef:
```typescript
const name = getClassRegistrationsForAttendanceRef.operationName;
console.log(name);
```

### Variables
The `GetClassRegistrationsForAttendance` query requires an argument of type `GetClassRegistrationsForAttendanceVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetClassRegistrationsForAttendanceVariables {
  orgId: UUIDString;
  classId: UUIDString;
  classDate: DateString;
}
```
### Return Type
Recall that executing the `GetClassRegistrationsForAttendance` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetClassRegistrationsForAttendanceData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetClassRegistrationsForAttendanceData {
  classRegistrations: ({
    id: UUIDString;
    status: string;
    createdAt: TimestampString;
    client: {
      id: UUIDString;
      name: string;
      email?: string | null;
      phone?: string | null;
    } & Client_Key;
  } & ClassRegistration_Key)[];
}
```
### Using `GetClassRegistrationsForAttendance`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getClassRegistrationsForAttendance, GetClassRegistrationsForAttendanceVariables } from '@bridgeway/database';

// The `GetClassRegistrationsForAttendance` query requires an argument of type `GetClassRegistrationsForAttendanceVariables`:
const getClassRegistrationsForAttendanceVars: GetClassRegistrationsForAttendanceVariables = {
  orgId: ..., 
  classId: ..., 
  classDate: ..., 
};

// Call the `getClassRegistrationsForAttendance()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getClassRegistrationsForAttendance(getClassRegistrationsForAttendanceVars);
// Variables can be defined inline as well.
const { data } = await getClassRegistrationsForAttendance({ orgId: ..., classId: ..., classDate: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getClassRegistrationsForAttendance(dataConnect, getClassRegistrationsForAttendanceVars);

console.log(data.classRegistrations);

// Or, you can use the `Promise` API.
getClassRegistrationsForAttendance(getClassRegistrationsForAttendanceVars).then((response) => {
  const data = response.data;
  console.log(data.classRegistrations);
});
```

### Using `GetClassRegistrationsForAttendance`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getClassRegistrationsForAttendanceRef, GetClassRegistrationsForAttendanceVariables } from '@bridgeway/database';

// The `GetClassRegistrationsForAttendance` query requires an argument of type `GetClassRegistrationsForAttendanceVariables`:
const getClassRegistrationsForAttendanceVars: GetClassRegistrationsForAttendanceVariables = {
  orgId: ..., 
  classId: ..., 
  classDate: ..., 
};

// Call the `getClassRegistrationsForAttendanceRef()` function to get a reference to the query.
const ref = getClassRegistrationsForAttendanceRef(getClassRegistrationsForAttendanceVars);
// Variables can be defined inline as well.
const ref = getClassRegistrationsForAttendanceRef({ orgId: ..., classId: ..., classDate: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getClassRegistrationsForAttendanceRef(dataConnect, getClassRegistrationsForAttendanceVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.classRegistrations);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.classRegistrations);
});
```

## GetClientsForRetention
You can execute the `GetClientsForRetention` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
getClientsForRetention(vars: GetClientsForRetentionVariables, options?: ExecuteQueryOptions): QueryPromise<GetClientsForRetentionData, GetClientsForRetentionVariables>;

interface GetClientsForRetentionRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetClientsForRetentionVariables): QueryRef<GetClientsForRetentionData, GetClientsForRetentionVariables>;
}
export const getClientsForRetentionRef: GetClientsForRetentionRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getClientsForRetention(dc: DataConnect, vars: GetClientsForRetentionVariables, options?: ExecuteQueryOptions): QueryPromise<GetClientsForRetentionData, GetClientsForRetentionVariables>;

interface GetClientsForRetentionRef {
  ...
  (dc: DataConnect, vars: GetClientsForRetentionVariables): QueryRef<GetClientsForRetentionData, GetClientsForRetentionVariables>;
}
export const getClientsForRetentionRef: GetClientsForRetentionRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getClientsForRetentionRef:
```typescript
const name = getClientsForRetentionRef.operationName;
console.log(name);
```

### Variables
The `GetClientsForRetention` query requires an argument of type `GetClientsForRetentionVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetClientsForRetentionVariables {
  orgId: UUIDString;
}
```
### Return Type
Recall that executing the `GetClientsForRetention` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetClientsForRetentionData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetClientsForRetentionData {
  clients: ({
    id: UUIDString;
    name: string;
    email?: string | null;
    phone?: string | null;
    dateOfBirth?: DateString | null;
  } & Client_Key)[];
}
```
### Using `GetClientsForRetention`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getClientsForRetention, GetClientsForRetentionVariables } from '@bridgeway/database';

// The `GetClientsForRetention` query requires an argument of type `GetClientsForRetentionVariables`:
const getClientsForRetentionVars: GetClientsForRetentionVariables = {
  orgId: ..., 
};

// Call the `getClientsForRetention()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getClientsForRetention(getClientsForRetentionVars);
// Variables can be defined inline as well.
const { data } = await getClientsForRetention({ orgId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getClientsForRetention(dataConnect, getClientsForRetentionVars);

console.log(data.clients);

// Or, you can use the `Promise` API.
getClientsForRetention(getClientsForRetentionVars).then((response) => {
  const data = response.data;
  console.log(data.clients);
});
```

### Using `GetClientsForRetention`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getClientsForRetentionRef, GetClientsForRetentionVariables } from '@bridgeway/database';

// The `GetClientsForRetention` query requires an argument of type `GetClientsForRetentionVariables`:
const getClientsForRetentionVars: GetClientsForRetentionVariables = {
  orgId: ..., 
};

// Call the `getClientsForRetentionRef()` function to get a reference to the query.
const ref = getClientsForRetentionRef(getClientsForRetentionVars);
// Variables can be defined inline as well.
const ref = getClientsForRetentionRef({ orgId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getClientsForRetentionRef(dataConnect, getClientsForRetentionVars);

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

## GetCompletedAppointmentsForRetention
You can execute the `GetCompletedAppointmentsForRetention` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
getCompletedAppointmentsForRetention(vars: GetCompletedAppointmentsForRetentionVariables, options?: ExecuteQueryOptions): QueryPromise<GetCompletedAppointmentsForRetentionData, GetCompletedAppointmentsForRetentionVariables>;

interface GetCompletedAppointmentsForRetentionRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetCompletedAppointmentsForRetentionVariables): QueryRef<GetCompletedAppointmentsForRetentionData, GetCompletedAppointmentsForRetentionVariables>;
}
export const getCompletedAppointmentsForRetentionRef: GetCompletedAppointmentsForRetentionRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getCompletedAppointmentsForRetention(dc: DataConnect, vars: GetCompletedAppointmentsForRetentionVariables, options?: ExecuteQueryOptions): QueryPromise<GetCompletedAppointmentsForRetentionData, GetCompletedAppointmentsForRetentionVariables>;

interface GetCompletedAppointmentsForRetentionRef {
  ...
  (dc: DataConnect, vars: GetCompletedAppointmentsForRetentionVariables): QueryRef<GetCompletedAppointmentsForRetentionData, GetCompletedAppointmentsForRetentionVariables>;
}
export const getCompletedAppointmentsForRetentionRef: GetCompletedAppointmentsForRetentionRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getCompletedAppointmentsForRetentionRef:
```typescript
const name = getCompletedAppointmentsForRetentionRef.operationName;
console.log(name);
```

### Variables
The `GetCompletedAppointmentsForRetention` query requires an argument of type `GetCompletedAppointmentsForRetentionVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetCompletedAppointmentsForRetentionVariables {
  orgId: UUIDString;
}
```
### Return Type
Recall that executing the `GetCompletedAppointmentsForRetention` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetCompletedAppointmentsForRetentionData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetCompletedAppointmentsForRetentionData {
  appointments: ({
    id: UUIDString;
    scheduledAt: TimestampString;
    client?: {
      id: UUIDString;
    } & Client_Key;
  } & Appointment_Key)[];
}
```
### Using `GetCompletedAppointmentsForRetention`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getCompletedAppointmentsForRetention, GetCompletedAppointmentsForRetentionVariables } from '@bridgeway/database';

// The `GetCompletedAppointmentsForRetention` query requires an argument of type `GetCompletedAppointmentsForRetentionVariables`:
const getCompletedAppointmentsForRetentionVars: GetCompletedAppointmentsForRetentionVariables = {
  orgId: ..., 
};

// Call the `getCompletedAppointmentsForRetention()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getCompletedAppointmentsForRetention(getCompletedAppointmentsForRetentionVars);
// Variables can be defined inline as well.
const { data } = await getCompletedAppointmentsForRetention({ orgId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getCompletedAppointmentsForRetention(dataConnect, getCompletedAppointmentsForRetentionVars);

console.log(data.appointments);

// Or, you can use the `Promise` API.
getCompletedAppointmentsForRetention(getCompletedAppointmentsForRetentionVars).then((response) => {
  const data = response.data;
  console.log(data.appointments);
});
```

### Using `GetCompletedAppointmentsForRetention`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getCompletedAppointmentsForRetentionRef, GetCompletedAppointmentsForRetentionVariables } from '@bridgeway/database';

// The `GetCompletedAppointmentsForRetention` query requires an argument of type `GetCompletedAppointmentsForRetentionVariables`:
const getCompletedAppointmentsForRetentionVars: GetCompletedAppointmentsForRetentionVariables = {
  orgId: ..., 
};

// Call the `getCompletedAppointmentsForRetentionRef()` function to get a reference to the query.
const ref = getCompletedAppointmentsForRetentionRef(getCompletedAppointmentsForRetentionVars);
// Variables can be defined inline as well.
const ref = getCompletedAppointmentsForRetentionRef({ orgId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getCompletedAppointmentsForRetentionRef(dataConnect, getCompletedAppointmentsForRetentionVars);

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

## GetOrgClientPackages
You can execute the `GetOrgClientPackages` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
getOrgClientPackages(vars: GetOrgClientPackagesVariables, options?: ExecuteQueryOptions): QueryPromise<GetOrgClientPackagesData, GetOrgClientPackagesVariables>;

interface GetOrgClientPackagesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetOrgClientPackagesVariables): QueryRef<GetOrgClientPackagesData, GetOrgClientPackagesVariables>;
}
export const getOrgClientPackagesRef: GetOrgClientPackagesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getOrgClientPackages(dc: DataConnect, vars: GetOrgClientPackagesVariables, options?: ExecuteQueryOptions): QueryPromise<GetOrgClientPackagesData, GetOrgClientPackagesVariables>;

interface GetOrgClientPackagesRef {
  ...
  (dc: DataConnect, vars: GetOrgClientPackagesVariables): QueryRef<GetOrgClientPackagesData, GetOrgClientPackagesVariables>;
}
export const getOrgClientPackagesRef: GetOrgClientPackagesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getOrgClientPackagesRef:
```typescript
const name = getOrgClientPackagesRef.operationName;
console.log(name);
```

### Variables
The `GetOrgClientPackages` query requires an argument of type `GetOrgClientPackagesVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetOrgClientPackagesVariables {
  orgId: UUIDString;
}
```
### Return Type
Recall that executing the `GetOrgClientPackages` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetOrgClientPackagesData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetOrgClientPackagesData {
  clientPackages: ({
    id: UUIDString;
    name: string;
    totalSessions: number;
    usedSessions: number;
    price?: number | null;
    purchasedAt: TimestampString;
    expiresAt?: TimestampString | null;
    status: string;
    client: {
      id: UUIDString;
      name: string;
      email?: string | null;
    } & Client_Key;
  } & ClientPackage_Key)[];
}
```
### Using `GetOrgClientPackages`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getOrgClientPackages, GetOrgClientPackagesVariables } from '@bridgeway/database';

// The `GetOrgClientPackages` query requires an argument of type `GetOrgClientPackagesVariables`:
const getOrgClientPackagesVars: GetOrgClientPackagesVariables = {
  orgId: ..., 
};

// Call the `getOrgClientPackages()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getOrgClientPackages(getOrgClientPackagesVars);
// Variables can be defined inline as well.
const { data } = await getOrgClientPackages({ orgId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getOrgClientPackages(dataConnect, getOrgClientPackagesVars);

console.log(data.clientPackages);

// Or, you can use the `Promise` API.
getOrgClientPackages(getOrgClientPackagesVars).then((response) => {
  const data = response.data;
  console.log(data.clientPackages);
});
```

### Using `GetOrgClientPackages`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getOrgClientPackagesRef, GetOrgClientPackagesVariables } from '@bridgeway/database';

// The `GetOrgClientPackages` query requires an argument of type `GetOrgClientPackagesVariables`:
const getOrgClientPackagesVars: GetOrgClientPackagesVariables = {
  orgId: ..., 
};

// Call the `getOrgClientPackagesRef()` function to get a reference to the query.
const ref = getOrgClientPackagesRef(getOrgClientPackagesVars);
// Variables can be defined inline as well.
const ref = getOrgClientPackagesRef({ orgId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getOrgClientPackagesRef(dataConnect, getOrgClientPackagesVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.clientPackages);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.clientPackages);
});
```

## GetFloorLayout
You can execute the `GetFloorLayout` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
getFloorLayout(vars: GetFloorLayoutVariables, options?: ExecuteQueryOptions): QueryPromise<GetFloorLayoutData, GetFloorLayoutVariables>;

interface GetFloorLayoutRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetFloorLayoutVariables): QueryRef<GetFloorLayoutData, GetFloorLayoutVariables>;
}
export const getFloorLayoutRef: GetFloorLayoutRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getFloorLayout(dc: DataConnect, vars: GetFloorLayoutVariables, options?: ExecuteQueryOptions): QueryPromise<GetFloorLayoutData, GetFloorLayoutVariables>;

interface GetFloorLayoutRef {
  ...
  (dc: DataConnect, vars: GetFloorLayoutVariables): QueryRef<GetFloorLayoutData, GetFloorLayoutVariables>;
}
export const getFloorLayoutRef: GetFloorLayoutRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getFloorLayoutRef:
```typescript
const name = getFloorLayoutRef.operationName;
console.log(name);
```

### Variables
The `GetFloorLayout` query requires an argument of type `GetFloorLayoutVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetFloorLayoutVariables {
  orgId: UUIDString;
}
```
### Return Type
Recall that executing the `GetFloorLayout` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetFloorLayoutData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetFloorLayoutData {
  floorZones: ({
    id: UUIDString;
    name: string;
    capacity?: number | null;
  } & FloorZone_Key)[];
  seatAssignments: ({
    id: UUIDString;
    zone?: {
      id: UUIDString;
    } & FloorZone_Key;
    zoneName?: string | null;
    queueEntry?: {
      id: UUIDString;
    } & QueueEntry_Key;
    clientName?: string | null;
    assignedAt: TimestampString;
  } & SeatAssignment_Key)[];
}
```
### Using `GetFloorLayout`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getFloorLayout, GetFloorLayoutVariables } from '@bridgeway/database';

// The `GetFloorLayout` query requires an argument of type `GetFloorLayoutVariables`:
const getFloorLayoutVars: GetFloorLayoutVariables = {
  orgId: ..., 
};

// Call the `getFloorLayout()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getFloorLayout(getFloorLayoutVars);
// Variables can be defined inline as well.
const { data } = await getFloorLayout({ orgId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getFloorLayout(dataConnect, getFloorLayoutVars);

console.log(data.floorZones);
console.log(data.seatAssignments);

// Or, you can use the `Promise` API.
getFloorLayout(getFloorLayoutVars).then((response) => {
  const data = response.data;
  console.log(data.floorZones);
  console.log(data.seatAssignments);
});
```

### Using `GetFloorLayout`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getFloorLayoutRef, GetFloorLayoutVariables } from '@bridgeway/database';

// The `GetFloorLayout` query requires an argument of type `GetFloorLayoutVariables`:
const getFloorLayoutVars: GetFloorLayoutVariables = {
  orgId: ..., 
};

// Call the `getFloorLayoutRef()` function to get a reference to the query.
const ref = getFloorLayoutRef(getFloorLayoutVars);
// Variables can be defined inline as well.
const ref = getFloorLayoutRef({ orgId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getFloorLayoutRef(dataConnect, getFloorLayoutVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.floorZones);
console.log(data.seatAssignments);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.floorZones);
  console.log(data.seatAssignments);
});
```

## GetTodayFloorAppointments
You can execute the `GetTodayFloorAppointments` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
getTodayFloorAppointments(vars: GetTodayFloorAppointmentsVariables, options?: ExecuteQueryOptions): QueryPromise<GetTodayFloorAppointmentsData, GetTodayFloorAppointmentsVariables>;

interface GetTodayFloorAppointmentsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetTodayFloorAppointmentsVariables): QueryRef<GetTodayFloorAppointmentsData, GetTodayFloorAppointmentsVariables>;
}
export const getTodayFloorAppointmentsRef: GetTodayFloorAppointmentsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getTodayFloorAppointments(dc: DataConnect, vars: GetTodayFloorAppointmentsVariables, options?: ExecuteQueryOptions): QueryPromise<GetTodayFloorAppointmentsData, GetTodayFloorAppointmentsVariables>;

interface GetTodayFloorAppointmentsRef {
  ...
  (dc: DataConnect, vars: GetTodayFloorAppointmentsVariables): QueryRef<GetTodayFloorAppointmentsData, GetTodayFloorAppointmentsVariables>;
}
export const getTodayFloorAppointmentsRef: GetTodayFloorAppointmentsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getTodayFloorAppointmentsRef:
```typescript
const name = getTodayFloorAppointmentsRef.operationName;
console.log(name);
```

### Variables
The `GetTodayFloorAppointments` query requires an argument of type `GetTodayFloorAppointmentsVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetTodayFloorAppointmentsVariables {
  orgId: UUIDString;
  todayStart: TimestampString;
  todayEnd: TimestampString;
}
```
### Return Type
Recall that executing the `GetTodayFloorAppointments` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetTodayFloorAppointmentsData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetTodayFloorAppointmentsData {
  appointments: ({
    id: UUIDString;
    scheduledAt: TimestampString;
    status: string;
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
  } & Appointment_Key)[];
}
```
### Using `GetTodayFloorAppointments`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getTodayFloorAppointments, GetTodayFloorAppointmentsVariables } from '@bridgeway/database';

// The `GetTodayFloorAppointments` query requires an argument of type `GetTodayFloorAppointmentsVariables`:
const getTodayFloorAppointmentsVars: GetTodayFloorAppointmentsVariables = {
  orgId: ..., 
  todayStart: ..., 
  todayEnd: ..., 
};

// Call the `getTodayFloorAppointments()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getTodayFloorAppointments(getTodayFloorAppointmentsVars);
// Variables can be defined inline as well.
const { data } = await getTodayFloorAppointments({ orgId: ..., todayStart: ..., todayEnd: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getTodayFloorAppointments(dataConnect, getTodayFloorAppointmentsVars);

console.log(data.appointments);

// Or, you can use the `Promise` API.
getTodayFloorAppointments(getTodayFloorAppointmentsVars).then((response) => {
  const data = response.data;
  console.log(data.appointments);
});
```

### Using `GetTodayFloorAppointments`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getTodayFloorAppointmentsRef, GetTodayFloorAppointmentsVariables } from '@bridgeway/database';

// The `GetTodayFloorAppointments` query requires an argument of type `GetTodayFloorAppointmentsVariables`:
const getTodayFloorAppointmentsVars: GetTodayFloorAppointmentsVariables = {
  orgId: ..., 
  todayStart: ..., 
  todayEnd: ..., 
};

// Call the `getTodayFloorAppointmentsRef()` function to get a reference to the query.
const ref = getTodayFloorAppointmentsRef(getTodayFloorAppointmentsVars);
// Variables can be defined inline as well.
const ref = getTodayFloorAppointmentsRef({ orgId: ..., todayStart: ..., todayEnd: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getTodayFloorAppointmentsRef(dataConnect, getTodayFloorAppointmentsVars);

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

## GetUnconfirmedAppointments
You can execute the `GetUnconfirmedAppointments` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
getUnconfirmedAppointments(vars: GetUnconfirmedAppointmentsVariables, options?: ExecuteQueryOptions): QueryPromise<GetUnconfirmedAppointmentsData, GetUnconfirmedAppointmentsVariables>;

interface GetUnconfirmedAppointmentsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetUnconfirmedAppointmentsVariables): QueryRef<GetUnconfirmedAppointmentsData, GetUnconfirmedAppointmentsVariables>;
}
export const getUnconfirmedAppointmentsRef: GetUnconfirmedAppointmentsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getUnconfirmedAppointments(dc: DataConnect, vars: GetUnconfirmedAppointmentsVariables, options?: ExecuteQueryOptions): QueryPromise<GetUnconfirmedAppointmentsData, GetUnconfirmedAppointmentsVariables>;

interface GetUnconfirmedAppointmentsRef {
  ...
  (dc: DataConnect, vars: GetUnconfirmedAppointmentsVariables): QueryRef<GetUnconfirmedAppointmentsData, GetUnconfirmedAppointmentsVariables>;
}
export const getUnconfirmedAppointmentsRef: GetUnconfirmedAppointmentsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getUnconfirmedAppointmentsRef:
```typescript
const name = getUnconfirmedAppointmentsRef.operationName;
console.log(name);
```

### Variables
The `GetUnconfirmedAppointments` query requires an argument of type `GetUnconfirmedAppointmentsVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetUnconfirmedAppointmentsVariables {
  orgId: UUIDString;
  now: TimestampString;
  in48h: TimestampString;
}
```
### Return Type
Recall that executing the `GetUnconfirmedAppointments` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetUnconfirmedAppointmentsData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetUnconfirmedAppointmentsData {
  appointments: ({
    id: UUIDString;
    scheduledAt: TimestampString;
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
### Using `GetUnconfirmedAppointments`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getUnconfirmedAppointments, GetUnconfirmedAppointmentsVariables } from '@bridgeway/database';

// The `GetUnconfirmedAppointments` query requires an argument of type `GetUnconfirmedAppointmentsVariables`:
const getUnconfirmedAppointmentsVars: GetUnconfirmedAppointmentsVariables = {
  orgId: ..., 
  now: ..., 
  in48h: ..., 
};

// Call the `getUnconfirmedAppointments()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getUnconfirmedAppointments(getUnconfirmedAppointmentsVars);
// Variables can be defined inline as well.
const { data } = await getUnconfirmedAppointments({ orgId: ..., now: ..., in48h: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getUnconfirmedAppointments(dataConnect, getUnconfirmedAppointmentsVars);

console.log(data.appointments);

// Or, you can use the `Promise` API.
getUnconfirmedAppointments(getUnconfirmedAppointmentsVars).then((response) => {
  const data = response.data;
  console.log(data.appointments);
});
```

### Using `GetUnconfirmedAppointments`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getUnconfirmedAppointmentsRef, GetUnconfirmedAppointmentsVariables } from '@bridgeway/database';

// The `GetUnconfirmedAppointments` query requires an argument of type `GetUnconfirmedAppointmentsVariables`:
const getUnconfirmedAppointmentsVars: GetUnconfirmedAppointmentsVariables = {
  orgId: ..., 
  now: ..., 
  in48h: ..., 
};

// Call the `getUnconfirmedAppointmentsRef()` function to get a reference to the query.
const ref = getUnconfirmedAppointmentsRef(getUnconfirmedAppointmentsVars);
// Variables can be defined inline as well.
const ref = getUnconfirmedAppointmentsRef({ orgId: ..., now: ..., in48h: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getUnconfirmedAppointmentsRef(dataConnect, getUnconfirmedAppointmentsVars);

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

## GetPendingOrgBookings
You can execute the `GetPendingOrgBookings` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
getPendingOrgBookings(vars: GetPendingOrgBookingsVariables, options?: ExecuteQueryOptions): QueryPromise<GetPendingOrgBookingsData, GetPendingOrgBookingsVariables>;

interface GetPendingOrgBookingsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetPendingOrgBookingsVariables): QueryRef<GetPendingOrgBookingsData, GetPendingOrgBookingsVariables>;
}
export const getPendingOrgBookingsRef: GetPendingOrgBookingsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getPendingOrgBookings(dc: DataConnect, vars: GetPendingOrgBookingsVariables, options?: ExecuteQueryOptions): QueryPromise<GetPendingOrgBookingsData, GetPendingOrgBookingsVariables>;

interface GetPendingOrgBookingsRef {
  ...
  (dc: DataConnect, vars: GetPendingOrgBookingsVariables): QueryRef<GetPendingOrgBookingsData, GetPendingOrgBookingsVariables>;
}
export const getPendingOrgBookingsRef: GetPendingOrgBookingsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getPendingOrgBookingsRef:
```typescript
const name = getPendingOrgBookingsRef.operationName;
console.log(name);
```

### Variables
The `GetPendingOrgBookings` query requires an argument of type `GetPendingOrgBookingsVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetPendingOrgBookingsVariables {
  orgId: UUIDString;
}
```
### Return Type
Recall that executing the `GetPendingOrgBookings` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetPendingOrgBookingsData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetPendingOrgBookingsData {
  bookings: ({
    id: UUIDString;
    preferredDate?: DateString | null;
    preferredTime?: string | null;
    notes?: string | null;
    createdAt: TimestampString;
    service?: {
      id: UUIDString;
      name: string;
      durationMinutes?: number | null;
    } & Service_Key;
    slot?: {
      id: UUIDString;
      startTime: TimestampString;
    } & Slot_Key;
    name: string;
    email?: string | null;
    phone?: string | null;
  } & Booking_Key)[];
}
```
### Using `GetPendingOrgBookings`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getPendingOrgBookings, GetPendingOrgBookingsVariables } from '@bridgeway/database';

// The `GetPendingOrgBookings` query requires an argument of type `GetPendingOrgBookingsVariables`:
const getPendingOrgBookingsVars: GetPendingOrgBookingsVariables = {
  orgId: ..., 
};

// Call the `getPendingOrgBookings()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getPendingOrgBookings(getPendingOrgBookingsVars);
// Variables can be defined inline as well.
const { data } = await getPendingOrgBookings({ orgId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getPendingOrgBookings(dataConnect, getPendingOrgBookingsVars);

console.log(data.bookings);

// Or, you can use the `Promise` API.
getPendingOrgBookings(getPendingOrgBookingsVars).then((response) => {
  const data = response.data;
  console.log(data.bookings);
});
```

### Using `GetPendingOrgBookings`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getPendingOrgBookingsRef, GetPendingOrgBookingsVariables } from '@bridgeway/database';

// The `GetPendingOrgBookings` query requires an argument of type `GetPendingOrgBookingsVariables`:
const getPendingOrgBookingsVars: GetPendingOrgBookingsVariables = {
  orgId: ..., 
};

// Call the `getPendingOrgBookingsRef()` function to get a reference to the query.
const ref = getPendingOrgBookingsRef(getPendingOrgBookingsVars);
// Variables can be defined inline as well.
const ref = getPendingOrgBookingsRef({ orgId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getPendingOrgBookingsRef(dataConnect, getPendingOrgBookingsVars);

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

## GetOrgWaitlist
You can execute the `GetOrgWaitlist` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
getOrgWaitlist(vars: GetOrgWaitlistVariables, options?: ExecuteQueryOptions): QueryPromise<GetOrgWaitlistData, GetOrgWaitlistVariables>;

interface GetOrgWaitlistRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetOrgWaitlistVariables): QueryRef<GetOrgWaitlistData, GetOrgWaitlistVariables>;
}
export const getOrgWaitlistRef: GetOrgWaitlistRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getOrgWaitlist(dc: DataConnect, vars: GetOrgWaitlistVariables, options?: ExecuteQueryOptions): QueryPromise<GetOrgWaitlistData, GetOrgWaitlistVariables>;

interface GetOrgWaitlistRef {
  ...
  (dc: DataConnect, vars: GetOrgWaitlistVariables): QueryRef<GetOrgWaitlistData, GetOrgWaitlistVariables>;
}
export const getOrgWaitlistRef: GetOrgWaitlistRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getOrgWaitlistRef:
```typescript
const name = getOrgWaitlistRef.operationName;
console.log(name);
```

### Variables
The `GetOrgWaitlist` query requires an argument of type `GetOrgWaitlistVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetOrgWaitlistVariables {
  orgId: UUIDString;
}
```
### Return Type
Recall that executing the `GetOrgWaitlist` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetOrgWaitlistData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetOrgWaitlistData {
  classRegistrations: ({
    id: UUIDString;
    classDate: DateString;
    status: string;
    createdAt: TimestampString;
    client: {
      id: UUIDString;
      name: string;
      email?: string | null;
      phone?: string | null;
    } & Client_Key;
    classEntity: {
      id: UUIDString;
      name: string;
      dayOfWeek: number;
      startTime: string;
      capacity?: number | null;
    } & Class_Key;
  } & ClassRegistration_Key)[];
}
```
### Using `GetOrgWaitlist`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getOrgWaitlist, GetOrgWaitlistVariables } from '@bridgeway/database';

// The `GetOrgWaitlist` query requires an argument of type `GetOrgWaitlistVariables`:
const getOrgWaitlistVars: GetOrgWaitlistVariables = {
  orgId: ..., 
};

// Call the `getOrgWaitlist()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getOrgWaitlist(getOrgWaitlistVars);
// Variables can be defined inline as well.
const { data } = await getOrgWaitlist({ orgId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getOrgWaitlist(dataConnect, getOrgWaitlistVars);

console.log(data.classRegistrations);

// Or, you can use the `Promise` API.
getOrgWaitlist(getOrgWaitlistVars).then((response) => {
  const data = response.data;
  console.log(data.classRegistrations);
});
```

### Using `GetOrgWaitlist`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getOrgWaitlistRef, GetOrgWaitlistVariables } from '@bridgeway/database';

// The `GetOrgWaitlist` query requires an argument of type `GetOrgWaitlistVariables`:
const getOrgWaitlistVars: GetOrgWaitlistVariables = {
  orgId: ..., 
};

// Call the `getOrgWaitlistRef()` function to get a reference to the query.
const ref = getOrgWaitlistRef(getOrgWaitlistVars);
// Variables can be defined inline as well.
const ref = getOrgWaitlistRef({ orgId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getOrgWaitlistRef(dataConnect, getOrgWaitlistVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.classRegistrations);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.classRegistrations);
});
```

## GetOrgActivityLogs
You can execute the `GetOrgActivityLogs` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
getOrgActivityLogs(vars: GetOrgActivityLogsVariables, options?: ExecuteQueryOptions): QueryPromise<GetOrgActivityLogsData, GetOrgActivityLogsVariables>;

interface GetOrgActivityLogsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetOrgActivityLogsVariables): QueryRef<GetOrgActivityLogsData, GetOrgActivityLogsVariables>;
}
export const getOrgActivityLogsRef: GetOrgActivityLogsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getOrgActivityLogs(dc: DataConnect, vars: GetOrgActivityLogsVariables, options?: ExecuteQueryOptions): QueryPromise<GetOrgActivityLogsData, GetOrgActivityLogsVariables>;

interface GetOrgActivityLogsRef {
  ...
  (dc: DataConnect, vars: GetOrgActivityLogsVariables): QueryRef<GetOrgActivityLogsData, GetOrgActivityLogsVariables>;
}
export const getOrgActivityLogsRef: GetOrgActivityLogsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getOrgActivityLogsRef:
```typescript
const name = getOrgActivityLogsRef.operationName;
console.log(name);
```

### Variables
The `GetOrgActivityLogs` query requires an argument of type `GetOrgActivityLogsVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetOrgActivityLogsVariables {
  orgId: UUIDString;
  limit: number;
  offset: number;
}
```
### Return Type
Recall that executing the `GetOrgActivityLogs` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetOrgActivityLogsData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetOrgActivityLogsData {
  activityLogs: ({
    id: UUIDString;
    userId?: string | null;
    action: string;
    metadata?: unknown | null;
    createdAt: TimestampString;
  } & ActivityLog_Key)[];
}
```
### Using `GetOrgActivityLogs`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getOrgActivityLogs, GetOrgActivityLogsVariables } from '@bridgeway/database';

// The `GetOrgActivityLogs` query requires an argument of type `GetOrgActivityLogsVariables`:
const getOrgActivityLogsVars: GetOrgActivityLogsVariables = {
  orgId: ..., 
  limit: ..., 
  offset: ..., 
};

// Call the `getOrgActivityLogs()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getOrgActivityLogs(getOrgActivityLogsVars);
// Variables can be defined inline as well.
const { data } = await getOrgActivityLogs({ orgId: ..., limit: ..., offset: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getOrgActivityLogs(dataConnect, getOrgActivityLogsVars);

console.log(data.activityLogs);

// Or, you can use the `Promise` API.
getOrgActivityLogs(getOrgActivityLogsVars).then((response) => {
  const data = response.data;
  console.log(data.activityLogs);
});
```

### Using `GetOrgActivityLogs`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getOrgActivityLogsRef, GetOrgActivityLogsVariables } from '@bridgeway/database';

// The `GetOrgActivityLogs` query requires an argument of type `GetOrgActivityLogsVariables`:
const getOrgActivityLogsVars: GetOrgActivityLogsVariables = {
  orgId: ..., 
  limit: ..., 
  offset: ..., 
};

// Call the `getOrgActivityLogsRef()` function to get a reference to the query.
const ref = getOrgActivityLogsRef(getOrgActivityLogsVars);
// Variables can be defined inline as well.
const ref = getOrgActivityLogsRef({ orgId: ..., limit: ..., offset: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getOrgActivityLogsRef(dataConnect, getOrgActivityLogsVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.activityLogs);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.activityLogs);
});
```

## GetOrgPosTransactions
You can execute the `GetOrgPosTransactions` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
getOrgPosTransactions(vars: GetOrgPosTransactionsVariables, options?: ExecuteQueryOptions): QueryPromise<GetOrgPosTransactionsData, GetOrgPosTransactionsVariables>;

interface GetOrgPosTransactionsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetOrgPosTransactionsVariables): QueryRef<GetOrgPosTransactionsData, GetOrgPosTransactionsVariables>;
}
export const getOrgPosTransactionsRef: GetOrgPosTransactionsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getOrgPosTransactions(dc: DataConnect, vars: GetOrgPosTransactionsVariables, options?: ExecuteQueryOptions): QueryPromise<GetOrgPosTransactionsData, GetOrgPosTransactionsVariables>;

interface GetOrgPosTransactionsRef {
  ...
  (dc: DataConnect, vars: GetOrgPosTransactionsVariables): QueryRef<GetOrgPosTransactionsData, GetOrgPosTransactionsVariables>;
}
export const getOrgPosTransactionsRef: GetOrgPosTransactionsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getOrgPosTransactionsRef:
```typescript
const name = getOrgPosTransactionsRef.operationName;
console.log(name);
```

### Variables
The `GetOrgPosTransactions` query requires an argument of type `GetOrgPosTransactionsVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetOrgPosTransactionsVariables {
  orgId: UUIDString;
}
```
### Return Type
Recall that executing the `GetOrgPosTransactions` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetOrgPosTransactionsData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetOrgPosTransactionsData {
  posTransactions: ({
    id: UUIDString;
    tipCents?: number | null;
    totalCents: number;
    commissionAmount?: number | null;
    status?: string | null;
    createdAt: TimestampString;
    staff?: {
      id: UUIDString;
    } & Profile_Key;
  } & PosTransaction_Key)[];
}
```
### Using `GetOrgPosTransactions`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getOrgPosTransactions, GetOrgPosTransactionsVariables } from '@bridgeway/database';

// The `GetOrgPosTransactions` query requires an argument of type `GetOrgPosTransactionsVariables`:
const getOrgPosTransactionsVars: GetOrgPosTransactionsVariables = {
  orgId: ..., 
};

// Call the `getOrgPosTransactions()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getOrgPosTransactions(getOrgPosTransactionsVars);
// Variables can be defined inline as well.
const { data } = await getOrgPosTransactions({ orgId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getOrgPosTransactions(dataConnect, getOrgPosTransactionsVars);

console.log(data.posTransactions);

// Or, you can use the `Promise` API.
getOrgPosTransactions(getOrgPosTransactionsVars).then((response) => {
  const data = response.data;
  console.log(data.posTransactions);
});
```

### Using `GetOrgPosTransactions`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getOrgPosTransactionsRef, GetOrgPosTransactionsVariables } from '@bridgeway/database';

// The `GetOrgPosTransactions` query requires an argument of type `GetOrgPosTransactionsVariables`:
const getOrgPosTransactionsVars: GetOrgPosTransactionsVariables = {
  orgId: ..., 
};

// Call the `getOrgPosTransactionsRef()` function to get a reference to the query.
const ref = getOrgPosTransactionsRef(getOrgPosTransactionsVars);
// Variables can be defined inline as well.
const ref = getOrgPosTransactionsRef({ orgId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getOrgPosTransactionsRef(dataConnect, getOrgPosTransactionsVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.posTransactions);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.posTransactions);
});
```

## GetOrgById
You can execute the `GetOrgById` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
getOrgById(vars: GetOrgByIdVariables, options?: ExecuteQueryOptions): QueryPromise<GetOrgByIdData, GetOrgByIdVariables>;

interface GetOrgByIdRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetOrgByIdVariables): QueryRef<GetOrgByIdData, GetOrgByIdVariables>;
}
export const getOrgByIdRef: GetOrgByIdRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getOrgById(dc: DataConnect, vars: GetOrgByIdVariables, options?: ExecuteQueryOptions): QueryPromise<GetOrgByIdData, GetOrgByIdVariables>;

interface GetOrgByIdRef {
  ...
  (dc: DataConnect, vars: GetOrgByIdVariables): QueryRef<GetOrgByIdData, GetOrgByIdVariables>;
}
export const getOrgByIdRef: GetOrgByIdRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getOrgByIdRef:
```typescript
const name = getOrgByIdRef.operationName;
console.log(name);
```

### Variables
The `GetOrgById` query requires an argument of type `GetOrgByIdVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetOrgByIdVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `GetOrgById` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetOrgByIdData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetOrgByIdData {
  org?: {
    id: UUIDString;
    stripePublishableKey?: string | null;
  } & Org_Key;
}
```
### Using `GetOrgById`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getOrgById, GetOrgByIdVariables } from '@bridgeway/database';

// The `GetOrgById` query requires an argument of type `GetOrgByIdVariables`:
const getOrgByIdVars: GetOrgByIdVariables = {
  id: ..., 
};

// Call the `getOrgById()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getOrgById(getOrgByIdVars);
// Variables can be defined inline as well.
const { data } = await getOrgById({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getOrgById(dataConnect, getOrgByIdVars);

console.log(data.org);

// Or, you can use the `Promise` API.
getOrgById(getOrgByIdVars).then((response) => {
  const data = response.data;
  console.log(data.org);
});
```

### Using `GetOrgById`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getOrgByIdRef, GetOrgByIdVariables } from '@bridgeway/database';

// The `GetOrgById` query requires an argument of type `GetOrgByIdVariables`:
const getOrgByIdVars: GetOrgByIdVariables = {
  id: ..., 
};

// Call the `getOrgByIdRef()` function to get a reference to the query.
const ref = getOrgByIdRef(getOrgByIdVars);
// Variables can be defined inline as well.
const ref = getOrgByIdRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getOrgByIdRef(dataConnect, getOrgByIdVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.org);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.org);
});
```

## GetOrgIntakeTemplates
You can execute the `GetOrgIntakeTemplates` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
getOrgIntakeTemplates(vars: GetOrgIntakeTemplatesVariables, options?: ExecuteQueryOptions): QueryPromise<GetOrgIntakeTemplatesData, GetOrgIntakeTemplatesVariables>;

interface GetOrgIntakeTemplatesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetOrgIntakeTemplatesVariables): QueryRef<GetOrgIntakeTemplatesData, GetOrgIntakeTemplatesVariables>;
}
export const getOrgIntakeTemplatesRef: GetOrgIntakeTemplatesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getOrgIntakeTemplates(dc: DataConnect, vars: GetOrgIntakeTemplatesVariables, options?: ExecuteQueryOptions): QueryPromise<GetOrgIntakeTemplatesData, GetOrgIntakeTemplatesVariables>;

interface GetOrgIntakeTemplatesRef {
  ...
  (dc: DataConnect, vars: GetOrgIntakeTemplatesVariables): QueryRef<GetOrgIntakeTemplatesData, GetOrgIntakeTemplatesVariables>;
}
export const getOrgIntakeTemplatesRef: GetOrgIntakeTemplatesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getOrgIntakeTemplatesRef:
```typescript
const name = getOrgIntakeTemplatesRef.operationName;
console.log(name);
```

### Variables
The `GetOrgIntakeTemplates` query requires an argument of type `GetOrgIntakeTemplatesVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetOrgIntakeTemplatesVariables {
  orgId: UUIDString;
}
```
### Return Type
Recall that executing the `GetOrgIntakeTemplates` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetOrgIntakeTemplatesData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetOrgIntakeTemplatesData {
  intakeFormTemplates: ({
    id: UUIDString;
    name: string;
    fields: unknown;
    isActive?: boolean | null;
    createdAt: TimestampString;
  } & IntakeFormTemplate_Key)[];
}
```
### Using `GetOrgIntakeTemplates`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getOrgIntakeTemplates, GetOrgIntakeTemplatesVariables } from '@bridgeway/database';

// The `GetOrgIntakeTemplates` query requires an argument of type `GetOrgIntakeTemplatesVariables`:
const getOrgIntakeTemplatesVars: GetOrgIntakeTemplatesVariables = {
  orgId: ..., 
};

// Call the `getOrgIntakeTemplates()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getOrgIntakeTemplates(getOrgIntakeTemplatesVars);
// Variables can be defined inline as well.
const { data } = await getOrgIntakeTemplates({ orgId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getOrgIntakeTemplates(dataConnect, getOrgIntakeTemplatesVars);

console.log(data.intakeFormTemplates);

// Or, you can use the `Promise` API.
getOrgIntakeTemplates(getOrgIntakeTemplatesVars).then((response) => {
  const data = response.data;
  console.log(data.intakeFormTemplates);
});
```

### Using `GetOrgIntakeTemplates`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getOrgIntakeTemplatesRef, GetOrgIntakeTemplatesVariables } from '@bridgeway/database';

// The `GetOrgIntakeTemplates` query requires an argument of type `GetOrgIntakeTemplatesVariables`:
const getOrgIntakeTemplatesVars: GetOrgIntakeTemplatesVariables = {
  orgId: ..., 
};

// Call the `getOrgIntakeTemplatesRef()` function to get a reference to the query.
const ref = getOrgIntakeTemplatesRef(getOrgIntakeTemplatesVars);
// Variables can be defined inline as well.
const ref = getOrgIntakeTemplatesRef({ orgId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getOrgIntakeTemplatesRef(dataConnect, getOrgIntakeTemplatesVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.intakeFormTemplates);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.intakeFormTemplates);
});
```

## GetOrgServices
You can execute the `GetOrgServices` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
getOrgServices(vars: GetOrgServicesVariables, options?: ExecuteQueryOptions): QueryPromise<GetOrgServicesData, GetOrgServicesVariables>;

interface GetOrgServicesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetOrgServicesVariables): QueryRef<GetOrgServicesData, GetOrgServicesVariables>;
}
export const getOrgServicesRef: GetOrgServicesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getOrgServices(dc: DataConnect, vars: GetOrgServicesVariables, options?: ExecuteQueryOptions): QueryPromise<GetOrgServicesData, GetOrgServicesVariables>;

interface GetOrgServicesRef {
  ...
  (dc: DataConnect, vars: GetOrgServicesVariables): QueryRef<GetOrgServicesData, GetOrgServicesVariables>;
}
export const getOrgServicesRef: GetOrgServicesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getOrgServicesRef:
```typescript
const name = getOrgServicesRef.operationName;
console.log(name);
```

### Variables
The `GetOrgServices` query requires an argument of type `GetOrgServicesVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetOrgServicesVariables {
  orgId: UUIDString;
}
```
### Return Type
Recall that executing the `GetOrgServices` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetOrgServicesData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetOrgServicesData {
  services: ({
    id: UUIDString;
    name: string;
    durationMinutes?: number | null;
    price?: number | null;
    isArchived?: boolean | null;
  } & Service_Key)[];
}
```
### Using `GetOrgServices`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getOrgServices, GetOrgServicesVariables } from '@bridgeway/database';

// The `GetOrgServices` query requires an argument of type `GetOrgServicesVariables`:
const getOrgServicesVars: GetOrgServicesVariables = {
  orgId: ..., 
};

// Call the `getOrgServices()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getOrgServices(getOrgServicesVars);
// Variables can be defined inline as well.
const { data } = await getOrgServices({ orgId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getOrgServices(dataConnect, getOrgServicesVars);

console.log(data.services);

// Or, you can use the `Promise` API.
getOrgServices(getOrgServicesVars).then((response) => {
  const data = response.data;
  console.log(data.services);
});
```

### Using `GetOrgServices`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getOrgServicesRef, GetOrgServicesVariables } from '@bridgeway/database';

// The `GetOrgServices` query requires an argument of type `GetOrgServicesVariables`:
const getOrgServicesVars: GetOrgServicesVariables = {
  orgId: ..., 
};

// Call the `getOrgServicesRef()` function to get a reference to the query.
const ref = getOrgServicesRef(getOrgServicesVars);
// Variables can be defined inline as well.
const ref = getOrgServicesRef({ orgId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getOrgServicesRef(dataConnect, getOrgServicesVars);

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

## GetMarketingTriggers
You can execute the `GetMarketingTriggers` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
getMarketingTriggers(vars: GetMarketingTriggersVariables, options?: ExecuteQueryOptions): QueryPromise<GetMarketingTriggersData, GetMarketingTriggersVariables>;

interface GetMarketingTriggersRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetMarketingTriggersVariables): QueryRef<GetMarketingTriggersData, GetMarketingTriggersVariables>;
}
export const getMarketingTriggersRef: GetMarketingTriggersRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getMarketingTriggers(dc: DataConnect, vars: GetMarketingTriggersVariables, options?: ExecuteQueryOptions): QueryPromise<GetMarketingTriggersData, GetMarketingTriggersVariables>;

interface GetMarketingTriggersRef {
  ...
  (dc: DataConnect, vars: GetMarketingTriggersVariables): QueryRef<GetMarketingTriggersData, GetMarketingTriggersVariables>;
}
export const getMarketingTriggersRef: GetMarketingTriggersRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getMarketingTriggersRef:
```typescript
const name = getMarketingTriggersRef.operationName;
console.log(name);
```

### Variables
The `GetMarketingTriggers` query requires an argument of type `GetMarketingTriggersVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetMarketingTriggersVariables {
  orgId: UUIDString;
}
```
### Return Type
Recall that executing the `GetMarketingTriggers` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetMarketingTriggersData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetMarketingTriggersData {
  marketingTriggers: ({
    id: UUIDString;
    triggerId: string;
    title: string;
    description?: string | null;
    channel: string;
    enabled?: boolean | null;
    delayValue?: number | null;
    delayUnit?: string | null;
    message: string;
  } & MarketingTrigger_Key)[];
}
```
### Using `GetMarketingTriggers`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getMarketingTriggers, GetMarketingTriggersVariables } from '@bridgeway/database';

// The `GetMarketingTriggers` query requires an argument of type `GetMarketingTriggersVariables`:
const getMarketingTriggersVars: GetMarketingTriggersVariables = {
  orgId: ..., 
};

// Call the `getMarketingTriggers()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getMarketingTriggers(getMarketingTriggersVars);
// Variables can be defined inline as well.
const { data } = await getMarketingTriggers({ orgId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getMarketingTriggers(dataConnect, getMarketingTriggersVars);

console.log(data.marketingTriggers);

// Or, you can use the `Promise` API.
getMarketingTriggers(getMarketingTriggersVars).then((response) => {
  const data = response.data;
  console.log(data.marketingTriggers);
});
```

### Using `GetMarketingTriggers`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getMarketingTriggersRef, GetMarketingTriggersVariables } from '@bridgeway/database';

// The `GetMarketingTriggers` query requires an argument of type `GetMarketingTriggersVariables`:
const getMarketingTriggersVars: GetMarketingTriggersVariables = {
  orgId: ..., 
};

// Call the `getMarketingTriggersRef()` function to get a reference to the query.
const ref = getMarketingTriggersRef(getMarketingTriggersVars);
// Variables can be defined inline as well.
const ref = getMarketingTriggersRef({ orgId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getMarketingTriggersRef(dataConnect, getMarketingTriggersVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.marketingTriggers);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.marketingTriggers);
});
```

## GetNotificationSettings
You can execute the `GetNotificationSettings` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
getNotificationSettings(vars: GetNotificationSettingsVariables, options?: ExecuteQueryOptions): QueryPromise<GetNotificationSettingsData, GetNotificationSettingsVariables>;

interface GetNotificationSettingsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetNotificationSettingsVariables): QueryRef<GetNotificationSettingsData, GetNotificationSettingsVariables>;
}
export const getNotificationSettingsRef: GetNotificationSettingsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getNotificationSettings(dc: DataConnect, vars: GetNotificationSettingsVariables, options?: ExecuteQueryOptions): QueryPromise<GetNotificationSettingsData, GetNotificationSettingsVariables>;

interface GetNotificationSettingsRef {
  ...
  (dc: DataConnect, vars: GetNotificationSettingsVariables): QueryRef<GetNotificationSettingsData, GetNotificationSettingsVariables>;
}
export const getNotificationSettingsRef: GetNotificationSettingsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getNotificationSettingsRef:
```typescript
const name = getNotificationSettingsRef.operationName;
console.log(name);
```

### Variables
The `GetNotificationSettings` query requires an argument of type `GetNotificationSettingsVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetNotificationSettingsVariables {
  orgId: UUIDString;
}
```
### Return Type
Recall that executing the `GetNotificationSettings` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetNotificationSettingsData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetNotificationSettingsData {
  notificationSettings: ({
    id?: UUIDString | null;
    smsEnabled?: boolean | null;
    emailEnabled?: boolean | null;
    reminder24h?: boolean | null;
    reminder2h?: boolean | null;
  })[];
}
```
### Using `GetNotificationSettings`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getNotificationSettings, GetNotificationSettingsVariables } from '@bridgeway/database';

// The `GetNotificationSettings` query requires an argument of type `GetNotificationSettingsVariables`:
const getNotificationSettingsVars: GetNotificationSettingsVariables = {
  orgId: ..., 
};

// Call the `getNotificationSettings()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getNotificationSettings(getNotificationSettingsVars);
// Variables can be defined inline as well.
const { data } = await getNotificationSettings({ orgId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getNotificationSettings(dataConnect, getNotificationSettingsVars);

console.log(data.notificationSettings);

// Or, you can use the `Promise` API.
getNotificationSettings(getNotificationSettingsVars).then((response) => {
  const data = response.data;
  console.log(data.notificationSettings);
});
```

### Using `GetNotificationSettings`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getNotificationSettingsRef, GetNotificationSettingsVariables } from '@bridgeway/database';

// The `GetNotificationSettings` query requires an argument of type `GetNotificationSettingsVariables`:
const getNotificationSettingsVars: GetNotificationSettingsVariables = {
  orgId: ..., 
};

// Call the `getNotificationSettingsRef()` function to get a reference to the query.
const ref = getNotificationSettingsRef(getNotificationSettingsVars);
// Variables can be defined inline as well.
const ref = getNotificationSettingsRef({ orgId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getNotificationSettingsRef(dataConnect, getNotificationSettingsVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.notificationSettings);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.notificationSettings);
});
```

## GetOrgPackageTemplates
You can execute the `GetOrgPackageTemplates` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
getOrgPackageTemplates(vars: GetOrgPackageTemplatesVariables, options?: ExecuteQueryOptions): QueryPromise<GetOrgPackageTemplatesData, GetOrgPackageTemplatesVariables>;

interface GetOrgPackageTemplatesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetOrgPackageTemplatesVariables): QueryRef<GetOrgPackageTemplatesData, GetOrgPackageTemplatesVariables>;
}
export const getOrgPackageTemplatesRef: GetOrgPackageTemplatesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getOrgPackageTemplates(dc: DataConnect, vars: GetOrgPackageTemplatesVariables, options?: ExecuteQueryOptions): QueryPromise<GetOrgPackageTemplatesData, GetOrgPackageTemplatesVariables>;

interface GetOrgPackageTemplatesRef {
  ...
  (dc: DataConnect, vars: GetOrgPackageTemplatesVariables): QueryRef<GetOrgPackageTemplatesData, GetOrgPackageTemplatesVariables>;
}
export const getOrgPackageTemplatesRef: GetOrgPackageTemplatesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getOrgPackageTemplatesRef:
```typescript
const name = getOrgPackageTemplatesRef.operationName;
console.log(name);
```

### Variables
The `GetOrgPackageTemplates` query requires an argument of type `GetOrgPackageTemplatesVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetOrgPackageTemplatesVariables {
  orgId: UUIDString;
}
```
### Return Type
Recall that executing the `GetOrgPackageTemplates` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetOrgPackageTemplatesData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetOrgPackageTemplatesData {
  packageTemplates: ({
    id: UUIDString;
    name: string;
    type: string;
    sessionCount?: number | null;
    price: number;
    billingInterval?: string | null;
    expiryDays?: number | null;
    isActive?: boolean | null;
    service?: {
      id: UUIDString;
      name: string;
    } & Service_Key;
  } & PackageTemplate_Key)[];
}
```
### Using `GetOrgPackageTemplates`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getOrgPackageTemplates, GetOrgPackageTemplatesVariables } from '@bridgeway/database';

// The `GetOrgPackageTemplates` query requires an argument of type `GetOrgPackageTemplatesVariables`:
const getOrgPackageTemplatesVars: GetOrgPackageTemplatesVariables = {
  orgId: ..., 
};

// Call the `getOrgPackageTemplates()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getOrgPackageTemplates(getOrgPackageTemplatesVars);
// Variables can be defined inline as well.
const { data } = await getOrgPackageTemplates({ orgId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getOrgPackageTemplates(dataConnect, getOrgPackageTemplatesVars);

console.log(data.packageTemplates);

// Or, you can use the `Promise` API.
getOrgPackageTemplates(getOrgPackageTemplatesVars).then((response) => {
  const data = response.data;
  console.log(data.packageTemplates);
});
```

### Using `GetOrgPackageTemplates`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getOrgPackageTemplatesRef, GetOrgPackageTemplatesVariables } from '@bridgeway/database';

// The `GetOrgPackageTemplates` query requires an argument of type `GetOrgPackageTemplatesVariables`:
const getOrgPackageTemplatesVars: GetOrgPackageTemplatesVariables = {
  orgId: ..., 
};

// Call the `getOrgPackageTemplatesRef()` function to get a reference to the query.
const ref = getOrgPackageTemplatesRef(getOrgPackageTemplatesVars);
// Variables can be defined inline as well.
const ref = getOrgPackageTemplatesRef({ orgId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getOrgPackageTemplatesRef(dataConnect, getOrgPackageTemplatesVars);

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
  slotId?: UUIDString | null;
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
  slotId: ..., // optional
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
const { data } = await createBooking({ orgId: ..., serviceId: ..., slotId: ..., name: ..., email: ..., phone: ..., preferredDate: ..., preferredTime: ..., notes: ..., status: ..., paymentStatus: ..., });

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
  slotId: ..., // optional
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
const ref = createBookingRef({ orgId: ..., serviceId: ..., slotId: ..., name: ..., email: ..., phone: ..., preferredDate: ..., preferredTime: ..., notes: ..., status: ..., paymentStatus: ..., });

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
  clientId?: UUIDString | null;
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
  clientId: ..., // optional
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
  clientId: ..., // optional
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
  clientId?: UUIDString | null;
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
  clientId: ..., // optional
  serviceId: ..., // optional
  status: ..., 
  position: ..., 
};

// Call the `createQueueEntry()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createQueueEntry(createQueueEntryVars);
// Variables can be defined inline as well.
const { data } = await createQueueEntry({ orgId: ..., clientName: ..., clientId: ..., serviceId: ..., status: ..., position: ..., });

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
  clientId: ..., // optional
  serviceId: ..., // optional
  status: ..., 
  position: ..., 
};

// Call the `createQueueEntryRef()` function to get a reference to the mutation.
const ref = createQueueEntryRef(createQueueEntryVars);
// Variables can be defined inline as well.
const ref = createQueueEntryRef({ orgId: ..., clientName: ..., clientId: ..., serviceId: ..., status: ..., position: ..., });

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

## CreateProduct
You can execute the `CreateProduct` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
createProduct(vars: CreateProductVariables): MutationPromise<CreateProductData, CreateProductVariables>;

interface CreateProductRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateProductVariables): MutationRef<CreateProductData, CreateProductVariables>;
}
export const createProductRef: CreateProductRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createProduct(dc: DataConnect, vars: CreateProductVariables): MutationPromise<CreateProductData, CreateProductVariables>;

interface CreateProductRef {
  ...
  (dc: DataConnect, vars: CreateProductVariables): MutationRef<CreateProductData, CreateProductVariables>;
}
export const createProductRef: CreateProductRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createProductRef:
```typescript
const name = createProductRef.operationName;
console.log(name);
```

### Variables
The `CreateProduct` mutation requires an argument of type `CreateProductVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateProductVariables {
  orgId: UUIDString;
  name: string;
  priceCents: number;
  stockCount?: number | null;
  lowStockThreshold?: number | null;
  isActive: boolean;
}
```
### Return Type
Recall that executing the `CreateProduct` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateProductData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateProductData {
  product_insert: Product_Key;
}
```
### Using `CreateProduct`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createProduct, CreateProductVariables } from '@bridgeway/database';

// The `CreateProduct` mutation requires an argument of type `CreateProductVariables`:
const createProductVars: CreateProductVariables = {
  orgId: ..., 
  name: ..., 
  priceCents: ..., 
  stockCount: ..., // optional
  lowStockThreshold: ..., // optional
  isActive: ..., 
};

// Call the `createProduct()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createProduct(createProductVars);
// Variables can be defined inline as well.
const { data } = await createProduct({ orgId: ..., name: ..., priceCents: ..., stockCount: ..., lowStockThreshold: ..., isActive: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createProduct(dataConnect, createProductVars);

console.log(data.product_insert);

// Or, you can use the `Promise` API.
createProduct(createProductVars).then((response) => {
  const data = response.data;
  console.log(data.product_insert);
});
```

### Using `CreateProduct`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createProductRef, CreateProductVariables } from '@bridgeway/database';

// The `CreateProduct` mutation requires an argument of type `CreateProductVariables`:
const createProductVars: CreateProductVariables = {
  orgId: ..., 
  name: ..., 
  priceCents: ..., 
  stockCount: ..., // optional
  lowStockThreshold: ..., // optional
  isActive: ..., 
};

// Call the `createProductRef()` function to get a reference to the mutation.
const ref = createProductRef(createProductVars);
// Variables can be defined inline as well.
const ref = createProductRef({ orgId: ..., name: ..., priceCents: ..., stockCount: ..., lowStockThreshold: ..., isActive: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createProductRef(dataConnect, createProductVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.product_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.product_insert);
});
```

## UpdateProduct
You can execute the `UpdateProduct` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
updateProduct(vars: UpdateProductVariables): MutationPromise<UpdateProductData, UpdateProductVariables>;

interface UpdateProductRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateProductVariables): MutationRef<UpdateProductData, UpdateProductVariables>;
}
export const updateProductRef: UpdateProductRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateProduct(dc: DataConnect, vars: UpdateProductVariables): MutationPromise<UpdateProductData, UpdateProductVariables>;

interface UpdateProductRef {
  ...
  (dc: DataConnect, vars: UpdateProductVariables): MutationRef<UpdateProductData, UpdateProductVariables>;
}
export const updateProductRef: UpdateProductRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateProductRef:
```typescript
const name = updateProductRef.operationName;
console.log(name);
```

### Variables
The `UpdateProduct` mutation requires an argument of type `UpdateProductVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateProductVariables {
  id: UUIDString;
  name: string;
  priceCents: number;
  stockCount?: number | null;
  lowStockThreshold?: number | null;
  isActive: boolean;
}
```
### Return Type
Recall that executing the `UpdateProduct` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateProductData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateProductData {
  product_update?: Product_Key | null;
}
```
### Using `UpdateProduct`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateProduct, UpdateProductVariables } from '@bridgeway/database';

// The `UpdateProduct` mutation requires an argument of type `UpdateProductVariables`:
const updateProductVars: UpdateProductVariables = {
  id: ..., 
  name: ..., 
  priceCents: ..., 
  stockCount: ..., // optional
  lowStockThreshold: ..., // optional
  isActive: ..., 
};

// Call the `updateProduct()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateProduct(updateProductVars);
// Variables can be defined inline as well.
const { data } = await updateProduct({ id: ..., name: ..., priceCents: ..., stockCount: ..., lowStockThreshold: ..., isActive: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateProduct(dataConnect, updateProductVars);

console.log(data.product_update);

// Or, you can use the `Promise` API.
updateProduct(updateProductVars).then((response) => {
  const data = response.data;
  console.log(data.product_update);
});
```

### Using `UpdateProduct`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateProductRef, UpdateProductVariables } from '@bridgeway/database';

// The `UpdateProduct` mutation requires an argument of type `UpdateProductVariables`:
const updateProductVars: UpdateProductVariables = {
  id: ..., 
  name: ..., 
  priceCents: ..., 
  stockCount: ..., // optional
  lowStockThreshold: ..., // optional
  isActive: ..., 
};

// Call the `updateProductRef()` function to get a reference to the mutation.
const ref = updateProductRef(updateProductVars);
// Variables can be defined inline as well.
const ref = updateProductRef({ id: ..., name: ..., priceCents: ..., stockCount: ..., lowStockThreshold: ..., isActive: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateProductRef(dataConnect, updateProductVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.product_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.product_update);
});
```

## UpdateProductStock
You can execute the `UpdateProductStock` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
updateProductStock(vars: UpdateProductStockVariables): MutationPromise<UpdateProductStockData, UpdateProductStockVariables>;

interface UpdateProductStockRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateProductStockVariables): MutationRef<UpdateProductStockData, UpdateProductStockVariables>;
}
export const updateProductStockRef: UpdateProductStockRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateProductStock(dc: DataConnect, vars: UpdateProductStockVariables): MutationPromise<UpdateProductStockData, UpdateProductStockVariables>;

interface UpdateProductStockRef {
  ...
  (dc: DataConnect, vars: UpdateProductStockVariables): MutationRef<UpdateProductStockData, UpdateProductStockVariables>;
}
export const updateProductStockRef: UpdateProductStockRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateProductStockRef:
```typescript
const name = updateProductStockRef.operationName;
console.log(name);
```

### Variables
The `UpdateProductStock` mutation requires an argument of type `UpdateProductStockVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateProductStockVariables {
  id: UUIDString;
  stockCount: number;
}
```
### Return Type
Recall that executing the `UpdateProductStock` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateProductStockData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateProductStockData {
  product_update?: Product_Key | null;
}
```
### Using `UpdateProductStock`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateProductStock, UpdateProductStockVariables } from '@bridgeway/database';

// The `UpdateProductStock` mutation requires an argument of type `UpdateProductStockVariables`:
const updateProductStockVars: UpdateProductStockVariables = {
  id: ..., 
  stockCount: ..., 
};

// Call the `updateProductStock()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateProductStock(updateProductStockVars);
// Variables can be defined inline as well.
const { data } = await updateProductStock({ id: ..., stockCount: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateProductStock(dataConnect, updateProductStockVars);

console.log(data.product_update);

// Or, you can use the `Promise` API.
updateProductStock(updateProductStockVars).then((response) => {
  const data = response.data;
  console.log(data.product_update);
});
```

### Using `UpdateProductStock`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateProductStockRef, UpdateProductStockVariables } from '@bridgeway/database';

// The `UpdateProductStock` mutation requires an argument of type `UpdateProductStockVariables`:
const updateProductStockVars: UpdateProductStockVariables = {
  id: ..., 
  stockCount: ..., 
};

// Call the `updateProductStockRef()` function to get a reference to the mutation.
const ref = updateProductStockRef(updateProductStockVars);
// Variables can be defined inline as well.
const ref = updateProductStockRef({ id: ..., stockCount: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateProductStockRef(dataConnect, updateProductStockVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.product_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.product_update);
});
```

## CreatePosTransaction
You can execute the `CreatePosTransaction` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
createPosTransaction(vars: CreatePosTransactionVariables): MutationPromise<CreatePosTransactionData, CreatePosTransactionVariables>;

interface CreatePosTransactionRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreatePosTransactionVariables): MutationRef<CreatePosTransactionData, CreatePosTransactionVariables>;
}
export const createPosTransactionRef: CreatePosTransactionRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createPosTransaction(dc: DataConnect, vars: CreatePosTransactionVariables): MutationPromise<CreatePosTransactionData, CreatePosTransactionVariables>;

interface CreatePosTransactionRef {
  ...
  (dc: DataConnect, vars: CreatePosTransactionVariables): MutationRef<CreatePosTransactionData, CreatePosTransactionVariables>;
}
export const createPosTransactionRef: CreatePosTransactionRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createPosTransactionRef:
```typescript
const name = createPosTransactionRef.operationName;
console.log(name);
```

### Variables
The `CreatePosTransaction` mutation requires an argument of type `CreatePosTransactionVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreatePosTransactionVariables {
  orgId: UUIDString;
  clientId?: UUIDString | null;
  staffId?: UUIDString | null;
  items: unknown;
  tipCents: number;
  totalCents: number;
  commissionAmount: number;
  status: string;
}
```
### Return Type
Recall that executing the `CreatePosTransaction` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreatePosTransactionData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreatePosTransactionData {
  posTransaction_insert: PosTransaction_Key;
}
```
### Using `CreatePosTransaction`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createPosTransaction, CreatePosTransactionVariables } from '@bridgeway/database';

// The `CreatePosTransaction` mutation requires an argument of type `CreatePosTransactionVariables`:
const createPosTransactionVars: CreatePosTransactionVariables = {
  orgId: ..., 
  clientId: ..., // optional
  staffId: ..., // optional
  items: ..., 
  tipCents: ..., 
  totalCents: ..., 
  commissionAmount: ..., 
  status: ..., 
};

// Call the `createPosTransaction()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createPosTransaction(createPosTransactionVars);
// Variables can be defined inline as well.
const { data } = await createPosTransaction({ orgId: ..., clientId: ..., staffId: ..., items: ..., tipCents: ..., totalCents: ..., commissionAmount: ..., status: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createPosTransaction(dataConnect, createPosTransactionVars);

console.log(data.posTransaction_insert);

// Or, you can use the `Promise` API.
createPosTransaction(createPosTransactionVars).then((response) => {
  const data = response.data;
  console.log(data.posTransaction_insert);
});
```

### Using `CreatePosTransaction`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createPosTransactionRef, CreatePosTransactionVariables } from '@bridgeway/database';

// The `CreatePosTransaction` mutation requires an argument of type `CreatePosTransactionVariables`:
const createPosTransactionVars: CreatePosTransactionVariables = {
  orgId: ..., 
  clientId: ..., // optional
  staffId: ..., // optional
  items: ..., 
  tipCents: ..., 
  totalCents: ..., 
  commissionAmount: ..., 
  status: ..., 
};

// Call the `createPosTransactionRef()` function to get a reference to the mutation.
const ref = createPosTransactionRef(createPosTransactionVars);
// Variables can be defined inline as well.
const ref = createPosTransactionRef({ orgId: ..., clientId: ..., staffId: ..., items: ..., tipCents: ..., totalCents: ..., commissionAmount: ..., status: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createPosTransactionRef(dataConnect, createPosTransactionVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.posTransaction_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.posTransaction_insert);
});
```

## CreateStaffShift
You can execute the `CreateStaffShift` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
createStaffShift(vars: CreateStaffShiftVariables): MutationPromise<CreateStaffShiftData, CreateStaffShiftVariables>;

interface CreateStaffShiftRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateStaffShiftVariables): MutationRef<CreateStaffShiftData, CreateStaffShiftVariables>;
}
export const createStaffShiftRef: CreateStaffShiftRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createStaffShift(dc: DataConnect, vars: CreateStaffShiftVariables): MutationPromise<CreateStaffShiftData, CreateStaffShiftVariables>;

interface CreateStaffShiftRef {
  ...
  (dc: DataConnect, vars: CreateStaffShiftVariables): MutationRef<CreateStaffShiftData, CreateStaffShiftVariables>;
}
export const createStaffShiftRef: CreateStaffShiftRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createStaffShiftRef:
```typescript
const name = createStaffShiftRef.operationName;
console.log(name);
```

### Variables
The `CreateStaffShift` mutation requires an argument of type `CreateStaffShiftVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateStaffShiftVariables {
  orgId: UUIDString;
  staffId: UUIDString;
  shiftDate: DateString;
  startTime: string;
  endTime: string;
  notes?: string | null;
}
```
### Return Type
Recall that executing the `CreateStaffShift` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateStaffShiftData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateStaffShiftData {
  staffShift_insert: StaffShift_Key;
}
```
### Using `CreateStaffShift`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createStaffShift, CreateStaffShiftVariables } from '@bridgeway/database';

// The `CreateStaffShift` mutation requires an argument of type `CreateStaffShiftVariables`:
const createStaffShiftVars: CreateStaffShiftVariables = {
  orgId: ..., 
  staffId: ..., 
  shiftDate: ..., 
  startTime: ..., 
  endTime: ..., 
  notes: ..., // optional
};

// Call the `createStaffShift()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createStaffShift(createStaffShiftVars);
// Variables can be defined inline as well.
const { data } = await createStaffShift({ orgId: ..., staffId: ..., shiftDate: ..., startTime: ..., endTime: ..., notes: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createStaffShift(dataConnect, createStaffShiftVars);

console.log(data.staffShift_insert);

// Or, you can use the `Promise` API.
createStaffShift(createStaffShiftVars).then((response) => {
  const data = response.data;
  console.log(data.staffShift_insert);
});
```

### Using `CreateStaffShift`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createStaffShiftRef, CreateStaffShiftVariables } from '@bridgeway/database';

// The `CreateStaffShift` mutation requires an argument of type `CreateStaffShiftVariables`:
const createStaffShiftVars: CreateStaffShiftVariables = {
  orgId: ..., 
  staffId: ..., 
  shiftDate: ..., 
  startTime: ..., 
  endTime: ..., 
  notes: ..., // optional
};

// Call the `createStaffShiftRef()` function to get a reference to the mutation.
const ref = createStaffShiftRef(createStaffShiftVars);
// Variables can be defined inline as well.
const ref = createStaffShiftRef({ orgId: ..., staffId: ..., shiftDate: ..., startTime: ..., endTime: ..., notes: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createStaffShiftRef(dataConnect, createStaffShiftVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.staffShift_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.staffShift_insert);
});
```

## DeleteStaffShift
You can execute the `DeleteStaffShift` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
deleteStaffShift(vars: DeleteStaffShiftVariables): MutationPromise<DeleteStaffShiftData, DeleteStaffShiftVariables>;

interface DeleteStaffShiftRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteStaffShiftVariables): MutationRef<DeleteStaffShiftData, DeleteStaffShiftVariables>;
}
export const deleteStaffShiftRef: DeleteStaffShiftRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteStaffShift(dc: DataConnect, vars: DeleteStaffShiftVariables): MutationPromise<DeleteStaffShiftData, DeleteStaffShiftVariables>;

interface DeleteStaffShiftRef {
  ...
  (dc: DataConnect, vars: DeleteStaffShiftVariables): MutationRef<DeleteStaffShiftData, DeleteStaffShiftVariables>;
}
export const deleteStaffShiftRef: DeleteStaffShiftRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteStaffShiftRef:
```typescript
const name = deleteStaffShiftRef.operationName;
console.log(name);
```

### Variables
The `DeleteStaffShift` mutation requires an argument of type `DeleteStaffShiftVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteStaffShiftVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteStaffShift` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteStaffShiftData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteStaffShiftData {
  staffShift_delete?: StaffShift_Key | null;
}
```
### Using `DeleteStaffShift`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteStaffShift, DeleteStaffShiftVariables } from '@bridgeway/database';

// The `DeleteStaffShift` mutation requires an argument of type `DeleteStaffShiftVariables`:
const deleteStaffShiftVars: DeleteStaffShiftVariables = {
  id: ..., 
};

// Call the `deleteStaffShift()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteStaffShift(deleteStaffShiftVars);
// Variables can be defined inline as well.
const { data } = await deleteStaffShift({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteStaffShift(dataConnect, deleteStaffShiftVars);

console.log(data.staffShift_delete);

// Or, you can use the `Promise` API.
deleteStaffShift(deleteStaffShiftVars).then((response) => {
  const data = response.data;
  console.log(data.staffShift_delete);
});
```

### Using `DeleteStaffShift`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteStaffShiftRef, DeleteStaffShiftVariables } from '@bridgeway/database';

// The `DeleteStaffShift` mutation requires an argument of type `DeleteStaffShiftVariables`:
const deleteStaffShiftVars: DeleteStaffShiftVariables = {
  id: ..., 
};

// Call the `deleteStaffShiftRef()` function to get a reference to the mutation.
const ref = deleteStaffShiftRef(deleteStaffShiftVars);
// Variables can be defined inline as well.
const ref = deleteStaffShiftRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteStaffShiftRef(dataConnect, deleteStaffShiftVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.staffShift_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.staffShift_delete);
});
```

## CreateSlot
You can execute the `CreateSlot` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
createSlot(vars: CreateSlotVariables): MutationPromise<CreateSlotData, CreateSlotVariables>;

interface CreateSlotRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateSlotVariables): MutationRef<CreateSlotData, CreateSlotVariables>;
}
export const createSlotRef: CreateSlotRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createSlot(dc: DataConnect, vars: CreateSlotVariables): MutationPromise<CreateSlotData, CreateSlotVariables>;

interface CreateSlotRef {
  ...
  (dc: DataConnect, vars: CreateSlotVariables): MutationRef<CreateSlotData, CreateSlotVariables>;
}
export const createSlotRef: CreateSlotRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createSlotRef:
```typescript
const name = createSlotRef.operationName;
console.log(name);
```

### Variables
The `CreateSlot` mutation requires an argument of type `CreateSlotVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateSlotVariables {
  orgId: UUIDString;
  startTime: TimestampString;
  endTime: TimestampString;
  status: string;
  staffId?: UUIDString | null;
}
```
### Return Type
Recall that executing the `CreateSlot` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateSlotData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateSlotData {
  slot_insert: Slot_Key;
}
```
### Using `CreateSlot`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createSlot, CreateSlotVariables } from '@bridgeway/database';

// The `CreateSlot` mutation requires an argument of type `CreateSlotVariables`:
const createSlotVars: CreateSlotVariables = {
  orgId: ..., 
  startTime: ..., 
  endTime: ..., 
  status: ..., 
  staffId: ..., // optional
};

// Call the `createSlot()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createSlot(createSlotVars);
// Variables can be defined inline as well.
const { data } = await createSlot({ orgId: ..., startTime: ..., endTime: ..., status: ..., staffId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createSlot(dataConnect, createSlotVars);

console.log(data.slot_insert);

// Or, you can use the `Promise` API.
createSlot(createSlotVars).then((response) => {
  const data = response.data;
  console.log(data.slot_insert);
});
```

### Using `CreateSlot`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createSlotRef, CreateSlotVariables } from '@bridgeway/database';

// The `CreateSlot` mutation requires an argument of type `CreateSlotVariables`:
const createSlotVars: CreateSlotVariables = {
  orgId: ..., 
  startTime: ..., 
  endTime: ..., 
  status: ..., 
  staffId: ..., // optional
};

// Call the `createSlotRef()` function to get a reference to the mutation.
const ref = createSlotRef(createSlotVars);
// Variables can be defined inline as well.
const ref = createSlotRef({ orgId: ..., startTime: ..., endTime: ..., status: ..., staffId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createSlotRef(dataConnect, createSlotVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.slot_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.slot_insert);
});
```

## UpdateSlotStatus
You can execute the `UpdateSlotStatus` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
updateSlotStatus(vars: UpdateSlotStatusVariables): MutationPromise<UpdateSlotStatusData, UpdateSlotStatusVariables>;

interface UpdateSlotStatusRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateSlotStatusVariables): MutationRef<UpdateSlotStatusData, UpdateSlotStatusVariables>;
}
export const updateSlotStatusRef: UpdateSlotStatusRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateSlotStatus(dc: DataConnect, vars: UpdateSlotStatusVariables): MutationPromise<UpdateSlotStatusData, UpdateSlotStatusVariables>;

interface UpdateSlotStatusRef {
  ...
  (dc: DataConnect, vars: UpdateSlotStatusVariables): MutationRef<UpdateSlotStatusData, UpdateSlotStatusVariables>;
}
export const updateSlotStatusRef: UpdateSlotStatusRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateSlotStatusRef:
```typescript
const name = updateSlotStatusRef.operationName;
console.log(name);
```

### Variables
The `UpdateSlotStatus` mutation requires an argument of type `UpdateSlotStatusVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateSlotStatusVariables {
  id: UUIDString;
  status: string;
}
```
### Return Type
Recall that executing the `UpdateSlotStatus` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateSlotStatusData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateSlotStatusData {
  slot_update?: Slot_Key | null;
}
```
### Using `UpdateSlotStatus`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateSlotStatus, UpdateSlotStatusVariables } from '@bridgeway/database';

// The `UpdateSlotStatus` mutation requires an argument of type `UpdateSlotStatusVariables`:
const updateSlotStatusVars: UpdateSlotStatusVariables = {
  id: ..., 
  status: ..., 
};

// Call the `updateSlotStatus()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateSlotStatus(updateSlotStatusVars);
// Variables can be defined inline as well.
const { data } = await updateSlotStatus({ id: ..., status: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateSlotStatus(dataConnect, updateSlotStatusVars);

console.log(data.slot_update);

// Or, you can use the `Promise` API.
updateSlotStatus(updateSlotStatusVars).then((response) => {
  const data = response.data;
  console.log(data.slot_update);
});
```

### Using `UpdateSlotStatus`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateSlotStatusRef, UpdateSlotStatusVariables } from '@bridgeway/database';

// The `UpdateSlotStatus` mutation requires an argument of type `UpdateSlotStatusVariables`:
const updateSlotStatusVars: UpdateSlotStatusVariables = {
  id: ..., 
  status: ..., 
};

// Call the `updateSlotStatusRef()` function to get a reference to the mutation.
const ref = updateSlotStatusRef(updateSlotStatusVars);
// Variables can be defined inline as well.
const ref = updateSlotStatusRef({ id: ..., status: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateSlotStatusRef(dataConnect, updateSlotStatusVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.slot_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.slot_update);
});
```

## DeleteSlot
You can execute the `DeleteSlot` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
deleteSlot(vars: DeleteSlotVariables): MutationPromise<DeleteSlotData, DeleteSlotVariables>;

interface DeleteSlotRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteSlotVariables): MutationRef<DeleteSlotData, DeleteSlotVariables>;
}
export const deleteSlotRef: DeleteSlotRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteSlot(dc: DataConnect, vars: DeleteSlotVariables): MutationPromise<DeleteSlotData, DeleteSlotVariables>;

interface DeleteSlotRef {
  ...
  (dc: DataConnect, vars: DeleteSlotVariables): MutationRef<DeleteSlotData, DeleteSlotVariables>;
}
export const deleteSlotRef: DeleteSlotRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteSlotRef:
```typescript
const name = deleteSlotRef.operationName;
console.log(name);
```

### Variables
The `DeleteSlot` mutation requires an argument of type `DeleteSlotVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteSlotVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteSlot` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteSlotData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteSlotData {
  slot_delete?: Slot_Key | null;
}
```
### Using `DeleteSlot`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteSlot, DeleteSlotVariables } from '@bridgeway/database';

// The `DeleteSlot` mutation requires an argument of type `DeleteSlotVariables`:
const deleteSlotVars: DeleteSlotVariables = {
  id: ..., 
};

// Call the `deleteSlot()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteSlot(deleteSlotVars);
// Variables can be defined inline as well.
const { data } = await deleteSlot({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteSlot(dataConnect, deleteSlotVars);

console.log(data.slot_delete);

// Or, you can use the `Promise` API.
deleteSlot(deleteSlotVars).then((response) => {
  const data = response.data;
  console.log(data.slot_delete);
});
```

### Using `DeleteSlot`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteSlotRef, DeleteSlotVariables } from '@bridgeway/database';

// The `DeleteSlot` mutation requires an argument of type `DeleteSlotVariables`:
const deleteSlotVars: DeleteSlotVariables = {
  id: ..., 
};

// Call the `deleteSlotRef()` function to get a reference to the mutation.
const ref = deleteSlotRef(deleteSlotVars);
// Variables can be defined inline as well.
const ref = deleteSlotRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteSlotRef(dataConnect, deleteSlotVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.slot_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.slot_delete);
});
```

## CreateClass
You can execute the `CreateClass` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
createClass(vars: CreateClassVariables): MutationPromise<CreateClassData, CreateClassVariables>;

interface CreateClassRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateClassVariables): MutationRef<CreateClassData, CreateClassVariables>;
}
export const createClassRef: CreateClassRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createClass(dc: DataConnect, vars: CreateClassVariables): MutationPromise<CreateClassData, CreateClassVariables>;

interface CreateClassRef {
  ...
  (dc: DataConnect, vars: CreateClassVariables): MutationRef<CreateClassData, CreateClassVariables>;
}
export const createClassRef: CreateClassRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createClassRef:
```typescript
const name = createClassRef.operationName;
console.log(name);
```

### Variables
The `CreateClass` mutation requires an argument of type `CreateClassVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateClassVariables {
  orgId: UUIDString;
  name: string;
  description?: string | null;
  instructorId?: UUIDString | null;
  dayOfWeek: number;
  startTime: string;
  durationMinutes: number;
  capacity: number;
  location?: string | null;
}
```
### Return Type
Recall that executing the `CreateClass` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateClassData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateClassData {
  class_insert: Class_Key;
}
```
### Using `CreateClass`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createClass, CreateClassVariables } from '@bridgeway/database';

// The `CreateClass` mutation requires an argument of type `CreateClassVariables`:
const createClassVars: CreateClassVariables = {
  orgId: ..., 
  name: ..., 
  description: ..., // optional
  instructorId: ..., // optional
  dayOfWeek: ..., 
  startTime: ..., 
  durationMinutes: ..., 
  capacity: ..., 
  location: ..., // optional
};

// Call the `createClass()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createClass(createClassVars);
// Variables can be defined inline as well.
const { data } = await createClass({ orgId: ..., name: ..., description: ..., instructorId: ..., dayOfWeek: ..., startTime: ..., durationMinutes: ..., capacity: ..., location: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createClass(dataConnect, createClassVars);

console.log(data.class_insert);

// Or, you can use the `Promise` API.
createClass(createClassVars).then((response) => {
  const data = response.data;
  console.log(data.class_insert);
});
```

### Using `CreateClass`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createClassRef, CreateClassVariables } from '@bridgeway/database';

// The `CreateClass` mutation requires an argument of type `CreateClassVariables`:
const createClassVars: CreateClassVariables = {
  orgId: ..., 
  name: ..., 
  description: ..., // optional
  instructorId: ..., // optional
  dayOfWeek: ..., 
  startTime: ..., 
  durationMinutes: ..., 
  capacity: ..., 
  location: ..., // optional
};

// Call the `createClassRef()` function to get a reference to the mutation.
const ref = createClassRef(createClassVars);
// Variables can be defined inline as well.
const ref = createClassRef({ orgId: ..., name: ..., description: ..., instructorId: ..., dayOfWeek: ..., startTime: ..., durationMinutes: ..., capacity: ..., location: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createClassRef(dataConnect, createClassVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.class_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.class_insert);
});
```

## UpdateClass
You can execute the `UpdateClass` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
updateClass(vars: UpdateClassVariables): MutationPromise<UpdateClassData, UpdateClassVariables>;

interface UpdateClassRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateClassVariables): MutationRef<UpdateClassData, UpdateClassVariables>;
}
export const updateClassRef: UpdateClassRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateClass(dc: DataConnect, vars: UpdateClassVariables): MutationPromise<UpdateClassData, UpdateClassVariables>;

interface UpdateClassRef {
  ...
  (dc: DataConnect, vars: UpdateClassVariables): MutationRef<UpdateClassData, UpdateClassVariables>;
}
export const updateClassRef: UpdateClassRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateClassRef:
```typescript
const name = updateClassRef.operationName;
console.log(name);
```

### Variables
The `UpdateClass` mutation requires an argument of type `UpdateClassVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateClassVariables {
  id: UUIDString;
  name: string;
  description?: string | null;
  instructorId?: UUIDString | null;
  dayOfWeek: number;
  startTime: string;
  durationMinutes: number;
  capacity: number;
  location?: string | null;
}
```
### Return Type
Recall that executing the `UpdateClass` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateClassData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateClassData {
  class_update?: Class_Key | null;
}
```
### Using `UpdateClass`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateClass, UpdateClassVariables } from '@bridgeway/database';

// The `UpdateClass` mutation requires an argument of type `UpdateClassVariables`:
const updateClassVars: UpdateClassVariables = {
  id: ..., 
  name: ..., 
  description: ..., // optional
  instructorId: ..., // optional
  dayOfWeek: ..., 
  startTime: ..., 
  durationMinutes: ..., 
  capacity: ..., 
  location: ..., // optional
};

// Call the `updateClass()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateClass(updateClassVars);
// Variables can be defined inline as well.
const { data } = await updateClass({ id: ..., name: ..., description: ..., instructorId: ..., dayOfWeek: ..., startTime: ..., durationMinutes: ..., capacity: ..., location: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateClass(dataConnect, updateClassVars);

console.log(data.class_update);

// Or, you can use the `Promise` API.
updateClass(updateClassVars).then((response) => {
  const data = response.data;
  console.log(data.class_update);
});
```

### Using `UpdateClass`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateClassRef, UpdateClassVariables } from '@bridgeway/database';

// The `UpdateClass` mutation requires an argument of type `UpdateClassVariables`:
const updateClassVars: UpdateClassVariables = {
  id: ..., 
  name: ..., 
  description: ..., // optional
  instructorId: ..., // optional
  dayOfWeek: ..., 
  startTime: ..., 
  durationMinutes: ..., 
  capacity: ..., 
  location: ..., // optional
};

// Call the `updateClassRef()` function to get a reference to the mutation.
const ref = updateClassRef(updateClassVars);
// Variables can be defined inline as well.
const ref = updateClassRef({ id: ..., name: ..., description: ..., instructorId: ..., dayOfWeek: ..., startTime: ..., durationMinutes: ..., capacity: ..., location: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateClassRef(dataConnect, updateClassVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.class_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.class_update);
});
```

## UpdateClassActiveStatus
You can execute the `UpdateClassActiveStatus` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
updateClassActiveStatus(vars: UpdateClassActiveStatusVariables): MutationPromise<UpdateClassActiveStatusData, UpdateClassActiveStatusVariables>;

interface UpdateClassActiveStatusRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateClassActiveStatusVariables): MutationRef<UpdateClassActiveStatusData, UpdateClassActiveStatusVariables>;
}
export const updateClassActiveStatusRef: UpdateClassActiveStatusRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateClassActiveStatus(dc: DataConnect, vars: UpdateClassActiveStatusVariables): MutationPromise<UpdateClassActiveStatusData, UpdateClassActiveStatusVariables>;

interface UpdateClassActiveStatusRef {
  ...
  (dc: DataConnect, vars: UpdateClassActiveStatusVariables): MutationRef<UpdateClassActiveStatusData, UpdateClassActiveStatusVariables>;
}
export const updateClassActiveStatusRef: UpdateClassActiveStatusRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateClassActiveStatusRef:
```typescript
const name = updateClassActiveStatusRef.operationName;
console.log(name);
```

### Variables
The `UpdateClassActiveStatus` mutation requires an argument of type `UpdateClassActiveStatusVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateClassActiveStatusVariables {
  id: UUIDString;
  isActive: boolean;
}
```
### Return Type
Recall that executing the `UpdateClassActiveStatus` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateClassActiveStatusData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateClassActiveStatusData {
  class_update?: Class_Key | null;
}
```
### Using `UpdateClassActiveStatus`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateClassActiveStatus, UpdateClassActiveStatusVariables } from '@bridgeway/database';

// The `UpdateClassActiveStatus` mutation requires an argument of type `UpdateClassActiveStatusVariables`:
const updateClassActiveStatusVars: UpdateClassActiveStatusVariables = {
  id: ..., 
  isActive: ..., 
};

// Call the `updateClassActiveStatus()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateClassActiveStatus(updateClassActiveStatusVars);
// Variables can be defined inline as well.
const { data } = await updateClassActiveStatus({ id: ..., isActive: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateClassActiveStatus(dataConnect, updateClassActiveStatusVars);

console.log(data.class_update);

// Or, you can use the `Promise` API.
updateClassActiveStatus(updateClassActiveStatusVars).then((response) => {
  const data = response.data;
  console.log(data.class_update);
});
```

### Using `UpdateClassActiveStatus`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateClassActiveStatusRef, UpdateClassActiveStatusVariables } from '@bridgeway/database';

// The `UpdateClassActiveStatus` mutation requires an argument of type `UpdateClassActiveStatusVariables`:
const updateClassActiveStatusVars: UpdateClassActiveStatusVariables = {
  id: ..., 
  isActive: ..., 
};

// Call the `updateClassActiveStatusRef()` function to get a reference to the mutation.
const ref = updateClassActiveStatusRef(updateClassActiveStatusVars);
// Variables can be defined inline as well.
const ref = updateClassActiveStatusRef({ id: ..., isActive: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateClassActiveStatusRef(dataConnect, updateClassActiveStatusVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.class_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.class_update);
});
```

## CreateClassRegistration
You can execute the `CreateClassRegistration` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
createClassRegistration(vars: CreateClassRegistrationVariables): MutationPromise<CreateClassRegistrationData, CreateClassRegistrationVariables>;

interface CreateClassRegistrationRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateClassRegistrationVariables): MutationRef<CreateClassRegistrationData, CreateClassRegistrationVariables>;
}
export const createClassRegistrationRef: CreateClassRegistrationRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createClassRegistration(dc: DataConnect, vars: CreateClassRegistrationVariables): MutationPromise<CreateClassRegistrationData, CreateClassRegistrationVariables>;

interface CreateClassRegistrationRef {
  ...
  (dc: DataConnect, vars: CreateClassRegistrationVariables): MutationRef<CreateClassRegistrationData, CreateClassRegistrationVariables>;
}
export const createClassRegistrationRef: CreateClassRegistrationRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createClassRegistrationRef:
```typescript
const name = createClassRegistrationRef.operationName;
console.log(name);
```

### Variables
The `CreateClassRegistration` mutation requires an argument of type `CreateClassRegistrationVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateClassRegistrationVariables {
  orgId: UUIDString;
  classId: UUIDString;
  clientId: UUIDString;
  classDate: DateString;
  status: string;
}
```
### Return Type
Recall that executing the `CreateClassRegistration` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateClassRegistrationData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateClassRegistrationData {
  classRegistration_insert: ClassRegistration_Key;
}
```
### Using `CreateClassRegistration`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createClassRegistration, CreateClassRegistrationVariables } from '@bridgeway/database';

// The `CreateClassRegistration` mutation requires an argument of type `CreateClassRegistrationVariables`:
const createClassRegistrationVars: CreateClassRegistrationVariables = {
  orgId: ..., 
  classId: ..., 
  clientId: ..., 
  classDate: ..., 
  status: ..., 
};

// Call the `createClassRegistration()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createClassRegistration(createClassRegistrationVars);
// Variables can be defined inline as well.
const { data } = await createClassRegistration({ orgId: ..., classId: ..., clientId: ..., classDate: ..., status: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createClassRegistration(dataConnect, createClassRegistrationVars);

console.log(data.classRegistration_insert);

// Or, you can use the `Promise` API.
createClassRegistration(createClassRegistrationVars).then((response) => {
  const data = response.data;
  console.log(data.classRegistration_insert);
});
```

### Using `CreateClassRegistration`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createClassRegistrationRef, CreateClassRegistrationVariables } from '@bridgeway/database';

// The `CreateClassRegistration` mutation requires an argument of type `CreateClassRegistrationVariables`:
const createClassRegistrationVars: CreateClassRegistrationVariables = {
  orgId: ..., 
  classId: ..., 
  clientId: ..., 
  classDate: ..., 
  status: ..., 
};

// Call the `createClassRegistrationRef()` function to get a reference to the mutation.
const ref = createClassRegistrationRef(createClassRegistrationVars);
// Variables can be defined inline as well.
const ref = createClassRegistrationRef({ orgId: ..., classId: ..., clientId: ..., classDate: ..., status: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createClassRegistrationRef(dataConnect, createClassRegistrationVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.classRegistration_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.classRegistration_insert);
});
```

## UpsertWidgetConfig
You can execute the `UpsertWidgetConfig` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
upsertWidgetConfig(vars: UpsertWidgetConfigVariables): MutationPromise<UpsertWidgetConfigData, UpsertWidgetConfigVariables>;

interface UpsertWidgetConfigRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertWidgetConfigVariables): MutationRef<UpsertWidgetConfigData, UpsertWidgetConfigVariables>;
}
export const upsertWidgetConfigRef: UpsertWidgetConfigRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
upsertWidgetConfig(dc: DataConnect, vars: UpsertWidgetConfigVariables): MutationPromise<UpsertWidgetConfigData, UpsertWidgetConfigVariables>;

interface UpsertWidgetConfigRef {
  ...
  (dc: DataConnect, vars: UpsertWidgetConfigVariables): MutationRef<UpsertWidgetConfigData, UpsertWidgetConfigVariables>;
}
export const upsertWidgetConfigRef: UpsertWidgetConfigRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the upsertWidgetConfigRef:
```typescript
const name = upsertWidgetConfigRef.operationName;
console.log(name);
```

### Variables
The `UpsertWidgetConfig` mutation requires an argument of type `UpsertWidgetConfigVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpsertWidgetConfigVariables {
  userId: string;
  orgId: UUIDString;
  config: unknown;
}
```
### Return Type
Recall that executing the `UpsertWidgetConfig` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpsertWidgetConfigData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpsertWidgetConfigData {
  widgetConfig_upsert: WidgetConfig_Key;
}
```
### Using `UpsertWidgetConfig`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, upsertWidgetConfig, UpsertWidgetConfigVariables } from '@bridgeway/database';

// The `UpsertWidgetConfig` mutation requires an argument of type `UpsertWidgetConfigVariables`:
const upsertWidgetConfigVars: UpsertWidgetConfigVariables = {
  userId: ..., 
  orgId: ..., 
  config: ..., 
};

// Call the `upsertWidgetConfig()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await upsertWidgetConfig(upsertWidgetConfigVars);
// Variables can be defined inline as well.
const { data } = await upsertWidgetConfig({ userId: ..., orgId: ..., config: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await upsertWidgetConfig(dataConnect, upsertWidgetConfigVars);

console.log(data.widgetConfig_upsert);

// Or, you can use the `Promise` API.
upsertWidgetConfig(upsertWidgetConfigVars).then((response) => {
  const data = response.data;
  console.log(data.widgetConfig_upsert);
});
```

### Using `UpsertWidgetConfig`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, upsertWidgetConfigRef, UpsertWidgetConfigVariables } from '@bridgeway/database';

// The `UpsertWidgetConfig` mutation requires an argument of type `UpsertWidgetConfigVariables`:
const upsertWidgetConfigVars: UpsertWidgetConfigVariables = {
  userId: ..., 
  orgId: ..., 
  config: ..., 
};

// Call the `upsertWidgetConfigRef()` function to get a reference to the mutation.
const ref = upsertWidgetConfigRef(upsertWidgetConfigVars);
// Variables can be defined inline as well.
const ref = upsertWidgetConfigRef({ userId: ..., orgId: ..., config: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = upsertWidgetConfigRef(dataConnect, upsertWidgetConfigVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.widgetConfig_upsert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.widgetConfig_upsert);
});
```

## UpdateProfileInfo
You can execute the `UpdateProfileInfo` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
updateProfileInfo(vars: UpdateProfileInfoVariables): MutationPromise<UpdateProfileInfoData, UpdateProfileInfoVariables>;

interface UpdateProfileInfoRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateProfileInfoVariables): MutationRef<UpdateProfileInfoData, UpdateProfileInfoVariables>;
}
export const updateProfileInfoRef: UpdateProfileInfoRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateProfileInfo(dc: DataConnect, vars: UpdateProfileInfoVariables): MutationPromise<UpdateProfileInfoData, UpdateProfileInfoVariables>;

interface UpdateProfileInfoRef {
  ...
  (dc: DataConnect, vars: UpdateProfileInfoVariables): MutationRef<UpdateProfileInfoData, UpdateProfileInfoVariables>;
}
export const updateProfileInfoRef: UpdateProfileInfoRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateProfileInfoRef:
```typescript
const name = updateProfileInfoRef.operationName;
console.log(name);
```

### Variables
The `UpdateProfileInfo` mutation requires an argument of type `UpdateProfileInfoVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateProfileInfoVariables {
  id: UUIDString;
  fullName: string;
  email: string;
  phone: string;
}
```
### Return Type
Recall that executing the `UpdateProfileInfo` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateProfileInfoData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateProfileInfoData {
  profile_update?: Profile_Key | null;
}
```
### Using `UpdateProfileInfo`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateProfileInfo, UpdateProfileInfoVariables } from '@bridgeway/database';

// The `UpdateProfileInfo` mutation requires an argument of type `UpdateProfileInfoVariables`:
const updateProfileInfoVars: UpdateProfileInfoVariables = {
  id: ..., 
  fullName: ..., 
  email: ..., 
  phone: ..., 
};

// Call the `updateProfileInfo()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateProfileInfo(updateProfileInfoVars);
// Variables can be defined inline as well.
const { data } = await updateProfileInfo({ id: ..., fullName: ..., email: ..., phone: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateProfileInfo(dataConnect, updateProfileInfoVars);

console.log(data.profile_update);

// Or, you can use the `Promise` API.
updateProfileInfo(updateProfileInfoVars).then((response) => {
  const data = response.data;
  console.log(data.profile_update);
});
```

### Using `UpdateProfileInfo`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateProfileInfoRef, UpdateProfileInfoVariables } from '@bridgeway/database';

// The `UpdateProfileInfo` mutation requires an argument of type `UpdateProfileInfoVariables`:
const updateProfileInfoVars: UpdateProfileInfoVariables = {
  id: ..., 
  fullName: ..., 
  email: ..., 
  phone: ..., 
};

// Call the `updateProfileInfoRef()` function to get a reference to the mutation.
const ref = updateProfileInfoRef(updateProfileInfoVars);
// Variables can be defined inline as well.
const ref = updateProfileInfoRef({ id: ..., fullName: ..., email: ..., phone: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateProfileInfoRef(dataConnect, updateProfileInfoVars);

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

## CreateIntakeSubmission
You can execute the `CreateIntakeSubmission` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
createIntakeSubmission(vars: CreateIntakeSubmissionVariables): MutationPromise<CreateIntakeSubmissionData, CreateIntakeSubmissionVariables>;

interface CreateIntakeSubmissionRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateIntakeSubmissionVariables): MutationRef<CreateIntakeSubmissionData, CreateIntakeSubmissionVariables>;
}
export const createIntakeSubmissionRef: CreateIntakeSubmissionRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createIntakeSubmission(dc: DataConnect, vars: CreateIntakeSubmissionVariables): MutationPromise<CreateIntakeSubmissionData, CreateIntakeSubmissionVariables>;

interface CreateIntakeSubmissionRef {
  ...
  (dc: DataConnect, vars: CreateIntakeSubmissionVariables): MutationRef<CreateIntakeSubmissionData, CreateIntakeSubmissionVariables>;
}
export const createIntakeSubmissionRef: CreateIntakeSubmissionRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createIntakeSubmissionRef:
```typescript
const name = createIntakeSubmissionRef.operationName;
console.log(name);
```

### Variables
The `CreateIntakeSubmission` mutation requires an argument of type `CreateIntakeSubmissionVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateIntakeSubmissionVariables {
  orgId: UUIDString;
  formId: UUIDString;
  clientId: UUIDString;
  appointmentId?: UUIDString | null;
  responses: unknown;
}
```
### Return Type
Recall that executing the `CreateIntakeSubmission` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateIntakeSubmissionData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateIntakeSubmissionData {
  intakeFormSubmission_insert: IntakeFormSubmission_Key;
}
```
### Using `CreateIntakeSubmission`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createIntakeSubmission, CreateIntakeSubmissionVariables } from '@bridgeway/database';

// The `CreateIntakeSubmission` mutation requires an argument of type `CreateIntakeSubmissionVariables`:
const createIntakeSubmissionVars: CreateIntakeSubmissionVariables = {
  orgId: ..., 
  formId: ..., 
  clientId: ..., 
  appointmentId: ..., // optional
  responses: ..., 
};

// Call the `createIntakeSubmission()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createIntakeSubmission(createIntakeSubmissionVars);
// Variables can be defined inline as well.
const { data } = await createIntakeSubmission({ orgId: ..., formId: ..., clientId: ..., appointmentId: ..., responses: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createIntakeSubmission(dataConnect, createIntakeSubmissionVars);

console.log(data.intakeFormSubmission_insert);

// Or, you can use the `Promise` API.
createIntakeSubmission(createIntakeSubmissionVars).then((response) => {
  const data = response.data;
  console.log(data.intakeFormSubmission_insert);
});
```

### Using `CreateIntakeSubmission`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createIntakeSubmissionRef, CreateIntakeSubmissionVariables } from '@bridgeway/database';

// The `CreateIntakeSubmission` mutation requires an argument of type `CreateIntakeSubmissionVariables`:
const createIntakeSubmissionVars: CreateIntakeSubmissionVariables = {
  orgId: ..., 
  formId: ..., 
  clientId: ..., 
  appointmentId: ..., // optional
  responses: ..., 
};

// Call the `createIntakeSubmissionRef()` function to get a reference to the mutation.
const ref = createIntakeSubmissionRef(createIntakeSubmissionVars);
// Variables can be defined inline as well.
const ref = createIntakeSubmissionRef({ orgId: ..., formId: ..., clientId: ..., appointmentId: ..., responses: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createIntakeSubmissionRef(dataConnect, createIntakeSubmissionVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.intakeFormSubmission_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.intakeFormSubmission_insert);
});
```

## UpdateClientPackageSessions
You can execute the `UpdateClientPackageSessions` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
updateClientPackageSessions(vars: UpdateClientPackageSessionsVariables): MutationPromise<UpdateClientPackageSessionsData, UpdateClientPackageSessionsVariables>;

interface UpdateClientPackageSessionsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateClientPackageSessionsVariables): MutationRef<UpdateClientPackageSessionsData, UpdateClientPackageSessionsVariables>;
}
export const updateClientPackageSessionsRef: UpdateClientPackageSessionsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateClientPackageSessions(dc: DataConnect, vars: UpdateClientPackageSessionsVariables): MutationPromise<UpdateClientPackageSessionsData, UpdateClientPackageSessionsVariables>;

interface UpdateClientPackageSessionsRef {
  ...
  (dc: DataConnect, vars: UpdateClientPackageSessionsVariables): MutationRef<UpdateClientPackageSessionsData, UpdateClientPackageSessionsVariables>;
}
export const updateClientPackageSessionsRef: UpdateClientPackageSessionsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateClientPackageSessionsRef:
```typescript
const name = updateClientPackageSessionsRef.operationName;
console.log(name);
```

### Variables
The `UpdateClientPackageSessions` mutation requires an argument of type `UpdateClientPackageSessionsVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateClientPackageSessionsVariables {
  id: UUIDString;
  usedSessions: number;
}
```
### Return Type
Recall that executing the `UpdateClientPackageSessions` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateClientPackageSessionsData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateClientPackageSessionsData {
  clientPackage_update?: ClientPackage_Key | null;
}
```
### Using `UpdateClientPackageSessions`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateClientPackageSessions, UpdateClientPackageSessionsVariables } from '@bridgeway/database';

// The `UpdateClientPackageSessions` mutation requires an argument of type `UpdateClientPackageSessionsVariables`:
const updateClientPackageSessionsVars: UpdateClientPackageSessionsVariables = {
  id: ..., 
  usedSessions: ..., 
};

// Call the `updateClientPackageSessions()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateClientPackageSessions(updateClientPackageSessionsVars);
// Variables can be defined inline as well.
const { data } = await updateClientPackageSessions({ id: ..., usedSessions: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateClientPackageSessions(dataConnect, updateClientPackageSessionsVars);

console.log(data.clientPackage_update);

// Or, you can use the `Promise` API.
updateClientPackageSessions(updateClientPackageSessionsVars).then((response) => {
  const data = response.data;
  console.log(data.clientPackage_update);
});
```

### Using `UpdateClientPackageSessions`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateClientPackageSessionsRef, UpdateClientPackageSessionsVariables } from '@bridgeway/database';

// The `UpdateClientPackageSessions` mutation requires an argument of type `UpdateClientPackageSessionsVariables`:
const updateClientPackageSessionsVars: UpdateClientPackageSessionsVariables = {
  id: ..., 
  usedSessions: ..., 
};

// Call the `updateClientPackageSessionsRef()` function to get a reference to the mutation.
const ref = updateClientPackageSessionsRef(updateClientPackageSessionsVars);
// Variables can be defined inline as well.
const ref = updateClientPackageSessionsRef({ id: ..., usedSessions: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateClientPackageSessionsRef(dataConnect, updateClientPackageSessionsVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.clientPackage_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.clientPackage_update);
});
```

## CreateAnnouncement
You can execute the `CreateAnnouncement` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
createAnnouncement(vars: CreateAnnouncementVariables): MutationPromise<CreateAnnouncementData, CreateAnnouncementVariables>;

interface CreateAnnouncementRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateAnnouncementVariables): MutationRef<CreateAnnouncementData, CreateAnnouncementVariables>;
}
export const createAnnouncementRef: CreateAnnouncementRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createAnnouncement(dc: DataConnect, vars: CreateAnnouncementVariables): MutationPromise<CreateAnnouncementData, CreateAnnouncementVariables>;

interface CreateAnnouncementRef {
  ...
  (dc: DataConnect, vars: CreateAnnouncementVariables): MutationRef<CreateAnnouncementData, CreateAnnouncementVariables>;
}
export const createAnnouncementRef: CreateAnnouncementRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createAnnouncementRef:
```typescript
const name = createAnnouncementRef.operationName;
console.log(name);
```

### Variables
The `CreateAnnouncement` mutation requires an argument of type `CreateAnnouncementVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateAnnouncementVariables {
  orgId: UUIDString;
  message: string;
  postedById: UUIDString;
}
```
### Return Type
Recall that executing the `CreateAnnouncement` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateAnnouncementData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateAnnouncementData {
  announcement_insert: Announcement_Key;
}
```
### Using `CreateAnnouncement`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createAnnouncement, CreateAnnouncementVariables } from '@bridgeway/database';

// The `CreateAnnouncement` mutation requires an argument of type `CreateAnnouncementVariables`:
const createAnnouncementVars: CreateAnnouncementVariables = {
  orgId: ..., 
  message: ..., 
  postedById: ..., 
};

// Call the `createAnnouncement()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createAnnouncement(createAnnouncementVars);
// Variables can be defined inline as well.
const { data } = await createAnnouncement({ orgId: ..., message: ..., postedById: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createAnnouncement(dataConnect, createAnnouncementVars);

console.log(data.announcement_insert);

// Or, you can use the `Promise` API.
createAnnouncement(createAnnouncementVars).then((response) => {
  const data = response.data;
  console.log(data.announcement_insert);
});
```

### Using `CreateAnnouncement`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createAnnouncementRef, CreateAnnouncementVariables } from '@bridgeway/database';

// The `CreateAnnouncement` mutation requires an argument of type `CreateAnnouncementVariables`:
const createAnnouncementVars: CreateAnnouncementVariables = {
  orgId: ..., 
  message: ..., 
  postedById: ..., 
};

// Call the `createAnnouncementRef()` function to get a reference to the mutation.
const ref = createAnnouncementRef(createAnnouncementVars);
// Variables can be defined inline as well.
const ref = createAnnouncementRef({ orgId: ..., message: ..., postedById: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createAnnouncementRef(dataConnect, createAnnouncementVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.announcement_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.announcement_insert);
});
```

## DeleteAnnouncement
You can execute the `DeleteAnnouncement` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
deleteAnnouncement(vars: DeleteAnnouncementVariables): MutationPromise<DeleteAnnouncementData, DeleteAnnouncementVariables>;

interface DeleteAnnouncementRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteAnnouncementVariables): MutationRef<DeleteAnnouncementData, DeleteAnnouncementVariables>;
}
export const deleteAnnouncementRef: DeleteAnnouncementRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteAnnouncement(dc: DataConnect, vars: DeleteAnnouncementVariables): MutationPromise<DeleteAnnouncementData, DeleteAnnouncementVariables>;

interface DeleteAnnouncementRef {
  ...
  (dc: DataConnect, vars: DeleteAnnouncementVariables): MutationRef<DeleteAnnouncementData, DeleteAnnouncementVariables>;
}
export const deleteAnnouncementRef: DeleteAnnouncementRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteAnnouncementRef:
```typescript
const name = deleteAnnouncementRef.operationName;
console.log(name);
```

### Variables
The `DeleteAnnouncement` mutation requires an argument of type `DeleteAnnouncementVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteAnnouncementVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteAnnouncement` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteAnnouncementData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteAnnouncementData {
  announcement_delete?: Announcement_Key | null;
}
```
### Using `DeleteAnnouncement`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteAnnouncement, DeleteAnnouncementVariables } from '@bridgeway/database';

// The `DeleteAnnouncement` mutation requires an argument of type `DeleteAnnouncementVariables`:
const deleteAnnouncementVars: DeleteAnnouncementVariables = {
  id: ..., 
};

// Call the `deleteAnnouncement()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteAnnouncement(deleteAnnouncementVars);
// Variables can be defined inline as well.
const { data } = await deleteAnnouncement({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteAnnouncement(dataConnect, deleteAnnouncementVars);

console.log(data.announcement_delete);

// Or, you can use the `Promise` API.
deleteAnnouncement(deleteAnnouncementVars).then((response) => {
  const data = response.data;
  console.log(data.announcement_delete);
});
```

### Using `DeleteAnnouncement`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteAnnouncementRef, DeleteAnnouncementVariables } from '@bridgeway/database';

// The `DeleteAnnouncement` mutation requires an argument of type `DeleteAnnouncementVariables`:
const deleteAnnouncementVars: DeleteAnnouncementVariables = {
  id: ..., 
};

// Call the `deleteAnnouncementRef()` function to get a reference to the mutation.
const ref = deleteAnnouncementRef(deleteAnnouncementVars);
// Variables can be defined inline as well.
const ref = deleteAnnouncementRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteAnnouncementRef(dataConnect, deleteAnnouncementVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.announcement_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.announcement_delete);
});
```

## UpdateClassRegistrationStatus
You can execute the `UpdateClassRegistrationStatus` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
updateClassRegistrationStatus(vars: UpdateClassRegistrationStatusVariables): MutationPromise<UpdateClassRegistrationStatusData, UpdateClassRegistrationStatusVariables>;

interface UpdateClassRegistrationStatusRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateClassRegistrationStatusVariables): MutationRef<UpdateClassRegistrationStatusData, UpdateClassRegistrationStatusVariables>;
}
export const updateClassRegistrationStatusRef: UpdateClassRegistrationStatusRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateClassRegistrationStatus(dc: DataConnect, vars: UpdateClassRegistrationStatusVariables): MutationPromise<UpdateClassRegistrationStatusData, UpdateClassRegistrationStatusVariables>;

interface UpdateClassRegistrationStatusRef {
  ...
  (dc: DataConnect, vars: UpdateClassRegistrationStatusVariables): MutationRef<UpdateClassRegistrationStatusData, UpdateClassRegistrationStatusVariables>;
}
export const updateClassRegistrationStatusRef: UpdateClassRegistrationStatusRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateClassRegistrationStatusRef:
```typescript
const name = updateClassRegistrationStatusRef.operationName;
console.log(name);
```

### Variables
The `UpdateClassRegistrationStatus` mutation requires an argument of type `UpdateClassRegistrationStatusVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateClassRegistrationStatusVariables {
  id: UUIDString;
  status: string;
}
```
### Return Type
Recall that executing the `UpdateClassRegistrationStatus` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateClassRegistrationStatusData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateClassRegistrationStatusData {
  classRegistration_update?: ClassRegistration_Key | null;
}
```
### Using `UpdateClassRegistrationStatus`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateClassRegistrationStatus, UpdateClassRegistrationStatusVariables } from '@bridgeway/database';

// The `UpdateClassRegistrationStatus` mutation requires an argument of type `UpdateClassRegistrationStatusVariables`:
const updateClassRegistrationStatusVars: UpdateClassRegistrationStatusVariables = {
  id: ..., 
  status: ..., 
};

// Call the `updateClassRegistrationStatus()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateClassRegistrationStatus(updateClassRegistrationStatusVars);
// Variables can be defined inline as well.
const { data } = await updateClassRegistrationStatus({ id: ..., status: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateClassRegistrationStatus(dataConnect, updateClassRegistrationStatusVars);

console.log(data.classRegistration_update);

// Or, you can use the `Promise` API.
updateClassRegistrationStatus(updateClassRegistrationStatusVars).then((response) => {
  const data = response.data;
  console.log(data.classRegistration_update);
});
```

### Using `UpdateClassRegistrationStatus`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateClassRegistrationStatusRef, UpdateClassRegistrationStatusVariables } from '@bridgeway/database';

// The `UpdateClassRegistrationStatus` mutation requires an argument of type `UpdateClassRegistrationStatusVariables`:
const updateClassRegistrationStatusVars: UpdateClassRegistrationStatusVariables = {
  id: ..., 
  status: ..., 
};

// Call the `updateClassRegistrationStatusRef()` function to get a reference to the mutation.
const ref = updateClassRegistrationStatusRef(updateClassRegistrationStatusVars);
// Variables can be defined inline as well.
const ref = updateClassRegistrationStatusRef({ id: ..., status: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateClassRegistrationStatusRef(dataConnect, updateClassRegistrationStatusVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.classRegistration_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.classRegistration_update);
});
```

## AssignSeat
You can execute the `AssignSeat` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
assignSeat(vars: AssignSeatVariables): MutationPromise<AssignSeatData, AssignSeatVariables>;

interface AssignSeatRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: AssignSeatVariables): MutationRef<AssignSeatData, AssignSeatVariables>;
}
export const assignSeatRef: AssignSeatRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
assignSeat(dc: DataConnect, vars: AssignSeatVariables): MutationPromise<AssignSeatData, AssignSeatVariables>;

interface AssignSeatRef {
  ...
  (dc: DataConnect, vars: AssignSeatVariables): MutationRef<AssignSeatData, AssignSeatVariables>;
}
export const assignSeatRef: AssignSeatRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the assignSeatRef:
```typescript
const name = assignSeatRef.operationName;
console.log(name);
```

### Variables
The `AssignSeat` mutation requires an argument of type `AssignSeatVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface AssignSeatVariables {
  orgId: UUIDString;
  zoneId: UUIDString;
  zoneName: string;
  queueEntryId: UUIDString;
  clientName: string;
}
```
### Return Type
Recall that executing the `AssignSeat` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AssignSeatData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface AssignSeatData {
  seatAssignment_insert: SeatAssignment_Key;
}
```
### Using `AssignSeat`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, assignSeat, AssignSeatVariables } from '@bridgeway/database';

// The `AssignSeat` mutation requires an argument of type `AssignSeatVariables`:
const assignSeatVars: AssignSeatVariables = {
  orgId: ..., 
  zoneId: ..., 
  zoneName: ..., 
  queueEntryId: ..., 
  clientName: ..., 
};

// Call the `assignSeat()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await assignSeat(assignSeatVars);
// Variables can be defined inline as well.
const { data } = await assignSeat({ orgId: ..., zoneId: ..., zoneName: ..., queueEntryId: ..., clientName: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await assignSeat(dataConnect, assignSeatVars);

console.log(data.seatAssignment_insert);

// Or, you can use the `Promise` API.
assignSeat(assignSeatVars).then((response) => {
  const data = response.data;
  console.log(data.seatAssignment_insert);
});
```

### Using `AssignSeat`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, assignSeatRef, AssignSeatVariables } from '@bridgeway/database';

// The `AssignSeat` mutation requires an argument of type `AssignSeatVariables`:
const assignSeatVars: AssignSeatVariables = {
  orgId: ..., 
  zoneId: ..., 
  zoneName: ..., 
  queueEntryId: ..., 
  clientName: ..., 
};

// Call the `assignSeatRef()` function to get a reference to the mutation.
const ref = assignSeatRef(assignSeatVars);
// Variables can be defined inline as well.
const ref = assignSeatRef({ orgId: ..., zoneId: ..., zoneName: ..., queueEntryId: ..., clientName: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = assignSeatRef(dataConnect, assignSeatVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.seatAssignment_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.seatAssignment_insert);
});
```

## ClearSeat
You can execute the `ClearSeat` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
clearSeat(vars: ClearSeatVariables): MutationPromise<ClearSeatData, ClearSeatVariables>;

interface ClearSeatRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ClearSeatVariables): MutationRef<ClearSeatData, ClearSeatVariables>;
}
export const clearSeatRef: ClearSeatRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
clearSeat(dc: DataConnect, vars: ClearSeatVariables): MutationPromise<ClearSeatData, ClearSeatVariables>;

interface ClearSeatRef {
  ...
  (dc: DataConnect, vars: ClearSeatVariables): MutationRef<ClearSeatData, ClearSeatVariables>;
}
export const clearSeatRef: ClearSeatRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the clearSeatRef:
```typescript
const name = clearSeatRef.operationName;
console.log(name);
```

### Variables
The `ClearSeat` mutation requires an argument of type `ClearSeatVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ClearSeatVariables {
  id: UUIDString;
  clearedAt: TimestampString;
}
```
### Return Type
Recall that executing the `ClearSeat` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ClearSeatData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ClearSeatData {
  seatAssignment_update?: SeatAssignment_Key | null;
}
```
### Using `ClearSeat`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, clearSeat, ClearSeatVariables } from '@bridgeway/database';

// The `ClearSeat` mutation requires an argument of type `ClearSeatVariables`:
const clearSeatVars: ClearSeatVariables = {
  id: ..., 
  clearedAt: ..., 
};

// Call the `clearSeat()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await clearSeat(clearSeatVars);
// Variables can be defined inline as well.
const { data } = await clearSeat({ id: ..., clearedAt: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await clearSeat(dataConnect, clearSeatVars);

console.log(data.seatAssignment_update);

// Or, you can use the `Promise` API.
clearSeat(clearSeatVars).then((response) => {
  const data = response.data;
  console.log(data.seatAssignment_update);
});
```

### Using `ClearSeat`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, clearSeatRef, ClearSeatVariables } from '@bridgeway/database';

// The `ClearSeat` mutation requires an argument of type `ClearSeatVariables`:
const clearSeatVars: ClearSeatVariables = {
  id: ..., 
  clearedAt: ..., 
};

// Call the `clearSeatRef()` function to get a reference to the mutation.
const ref = clearSeatRef(clearSeatVars);
// Variables can be defined inline as well.
const ref = clearSeatRef({ id: ..., clearedAt: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = clearSeatRef(dataConnect, clearSeatVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.seatAssignment_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.seatAssignment_update);
});
```

## UpdateOrgStripeCredentials
You can execute the `UpdateOrgStripeCredentials` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
updateOrgStripeCredentials(vars: UpdateOrgStripeCredentialsVariables): MutationPromise<UpdateOrgStripeCredentialsData, UpdateOrgStripeCredentialsVariables>;

interface UpdateOrgStripeCredentialsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateOrgStripeCredentialsVariables): MutationRef<UpdateOrgStripeCredentialsData, UpdateOrgStripeCredentialsVariables>;
}
export const updateOrgStripeCredentialsRef: UpdateOrgStripeCredentialsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateOrgStripeCredentials(dc: DataConnect, vars: UpdateOrgStripeCredentialsVariables): MutationPromise<UpdateOrgStripeCredentialsData, UpdateOrgStripeCredentialsVariables>;

interface UpdateOrgStripeCredentialsRef {
  ...
  (dc: DataConnect, vars: UpdateOrgStripeCredentialsVariables): MutationRef<UpdateOrgStripeCredentialsData, UpdateOrgStripeCredentialsVariables>;
}
export const updateOrgStripeCredentialsRef: UpdateOrgStripeCredentialsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateOrgStripeCredentialsRef:
```typescript
const name = updateOrgStripeCredentialsRef.operationName;
console.log(name);
```

### Variables
The `UpdateOrgStripeCredentials` mutation requires an argument of type `UpdateOrgStripeCredentialsVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateOrgStripeCredentialsVariables {
  orgId: UUIDString;
  stripePublishableKey?: string | null;
  stripeSecretKey?: string | null;
  paymentRequired?: boolean | null;
}
```
### Return Type
Recall that executing the `UpdateOrgStripeCredentials` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateOrgStripeCredentialsData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateOrgStripeCredentialsData {
  org_update?: Org_Key | null;
  orgSetting_upsert: OrgSetting_Key;
}
```
### Using `UpdateOrgStripeCredentials`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateOrgStripeCredentials, UpdateOrgStripeCredentialsVariables } from '@bridgeway/database';

// The `UpdateOrgStripeCredentials` mutation requires an argument of type `UpdateOrgStripeCredentialsVariables`:
const updateOrgStripeCredentialsVars: UpdateOrgStripeCredentialsVariables = {
  orgId: ..., 
  stripePublishableKey: ..., // optional
  stripeSecretKey: ..., // optional
  paymentRequired: ..., // optional
};

// Call the `updateOrgStripeCredentials()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateOrgStripeCredentials(updateOrgStripeCredentialsVars);
// Variables can be defined inline as well.
const { data } = await updateOrgStripeCredentials({ orgId: ..., stripePublishableKey: ..., stripeSecretKey: ..., paymentRequired: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateOrgStripeCredentials(dataConnect, updateOrgStripeCredentialsVars);

console.log(data.org_update);
console.log(data.orgSetting_upsert);

// Or, you can use the `Promise` API.
updateOrgStripeCredentials(updateOrgStripeCredentialsVars).then((response) => {
  const data = response.data;
  console.log(data.org_update);
  console.log(data.orgSetting_upsert);
});
```

### Using `UpdateOrgStripeCredentials`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateOrgStripeCredentialsRef, UpdateOrgStripeCredentialsVariables } from '@bridgeway/database';

// The `UpdateOrgStripeCredentials` mutation requires an argument of type `UpdateOrgStripeCredentialsVariables`:
const updateOrgStripeCredentialsVars: UpdateOrgStripeCredentialsVariables = {
  orgId: ..., 
  stripePublishableKey: ..., // optional
  stripeSecretKey: ..., // optional
  paymentRequired: ..., // optional
};

// Call the `updateOrgStripeCredentialsRef()` function to get a reference to the mutation.
const ref = updateOrgStripeCredentialsRef(updateOrgStripeCredentialsVars);
// Variables can be defined inline as well.
const ref = updateOrgStripeCredentialsRef({ orgId: ..., stripePublishableKey: ..., stripeSecretKey: ..., paymentRequired: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateOrgStripeCredentialsRef(dataConnect, updateOrgStripeCredentialsVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.org_update);
console.log(data.orgSetting_upsert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.org_update);
  console.log(data.orgSetting_upsert);
});
```

## UpdateProfileCommissionRate
You can execute the `UpdateProfileCommissionRate` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
updateProfileCommissionRate(vars: UpdateProfileCommissionRateVariables): MutationPromise<UpdateProfileCommissionRateData, UpdateProfileCommissionRateVariables>;

interface UpdateProfileCommissionRateRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateProfileCommissionRateVariables): MutationRef<UpdateProfileCommissionRateData, UpdateProfileCommissionRateVariables>;
}
export const updateProfileCommissionRateRef: UpdateProfileCommissionRateRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateProfileCommissionRate(dc: DataConnect, vars: UpdateProfileCommissionRateVariables): MutationPromise<UpdateProfileCommissionRateData, UpdateProfileCommissionRateVariables>;

interface UpdateProfileCommissionRateRef {
  ...
  (dc: DataConnect, vars: UpdateProfileCommissionRateVariables): MutationRef<UpdateProfileCommissionRateData, UpdateProfileCommissionRateVariables>;
}
export const updateProfileCommissionRateRef: UpdateProfileCommissionRateRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateProfileCommissionRateRef:
```typescript
const name = updateProfileCommissionRateRef.operationName;
console.log(name);
```

### Variables
The `UpdateProfileCommissionRate` mutation requires an argument of type `UpdateProfileCommissionRateVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateProfileCommissionRateVariables {
  id: UUIDString;
  commissionRatePercentage: number;
}
```
### Return Type
Recall that executing the `UpdateProfileCommissionRate` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateProfileCommissionRateData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateProfileCommissionRateData {
  profile_update?: Profile_Key | null;
}
```
### Using `UpdateProfileCommissionRate`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateProfileCommissionRate, UpdateProfileCommissionRateVariables } from '@bridgeway/database';

// The `UpdateProfileCommissionRate` mutation requires an argument of type `UpdateProfileCommissionRateVariables`:
const updateProfileCommissionRateVars: UpdateProfileCommissionRateVariables = {
  id: ..., 
  commissionRatePercentage: ..., 
};

// Call the `updateProfileCommissionRate()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateProfileCommissionRate(updateProfileCommissionRateVars);
// Variables can be defined inline as well.
const { data } = await updateProfileCommissionRate({ id: ..., commissionRatePercentage: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateProfileCommissionRate(dataConnect, updateProfileCommissionRateVars);

console.log(data.profile_update);

// Or, you can use the `Promise` API.
updateProfileCommissionRate(updateProfileCommissionRateVars).then((response) => {
  const data = response.data;
  console.log(data.profile_update);
});
```

### Using `UpdateProfileCommissionRate`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateProfileCommissionRateRef, UpdateProfileCommissionRateVariables } from '@bridgeway/database';

// The `UpdateProfileCommissionRate` mutation requires an argument of type `UpdateProfileCommissionRateVariables`:
const updateProfileCommissionRateVars: UpdateProfileCommissionRateVariables = {
  id: ..., 
  commissionRatePercentage: ..., 
};

// Call the `updateProfileCommissionRateRef()` function to get a reference to the mutation.
const ref = updateProfileCommissionRateRef(updateProfileCommissionRateVars);
// Variables can be defined inline as well.
const ref = updateProfileCommissionRateRef({ id: ..., commissionRatePercentage: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateProfileCommissionRateRef(dataConnect, updateProfileCommissionRateVars);

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

## CreateIntakeTemplate
You can execute the `CreateIntakeTemplate` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
createIntakeTemplate(vars: CreateIntakeTemplateVariables): MutationPromise<CreateIntakeTemplateData, CreateIntakeTemplateVariables>;

interface CreateIntakeTemplateRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateIntakeTemplateVariables): MutationRef<CreateIntakeTemplateData, CreateIntakeTemplateVariables>;
}
export const createIntakeTemplateRef: CreateIntakeTemplateRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createIntakeTemplate(dc: DataConnect, vars: CreateIntakeTemplateVariables): MutationPromise<CreateIntakeTemplateData, CreateIntakeTemplateVariables>;

interface CreateIntakeTemplateRef {
  ...
  (dc: DataConnect, vars: CreateIntakeTemplateVariables): MutationRef<CreateIntakeTemplateData, CreateIntakeTemplateVariables>;
}
export const createIntakeTemplateRef: CreateIntakeTemplateRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createIntakeTemplateRef:
```typescript
const name = createIntakeTemplateRef.operationName;
console.log(name);
```

### Variables
The `CreateIntakeTemplate` mutation requires an argument of type `CreateIntakeTemplateVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateIntakeTemplateVariables {
  orgId: UUIDString;
  name: string;
  fields: unknown;
  isActive: boolean;
}
```
### Return Type
Recall that executing the `CreateIntakeTemplate` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateIntakeTemplateData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateIntakeTemplateData {
  intakeFormTemplate_insert: IntakeFormTemplate_Key;
}
```
### Using `CreateIntakeTemplate`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createIntakeTemplate, CreateIntakeTemplateVariables } from '@bridgeway/database';

// The `CreateIntakeTemplate` mutation requires an argument of type `CreateIntakeTemplateVariables`:
const createIntakeTemplateVars: CreateIntakeTemplateVariables = {
  orgId: ..., 
  name: ..., 
  fields: ..., 
  isActive: ..., 
};

// Call the `createIntakeTemplate()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createIntakeTemplate(createIntakeTemplateVars);
// Variables can be defined inline as well.
const { data } = await createIntakeTemplate({ orgId: ..., name: ..., fields: ..., isActive: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createIntakeTemplate(dataConnect, createIntakeTemplateVars);

console.log(data.intakeFormTemplate_insert);

// Or, you can use the `Promise` API.
createIntakeTemplate(createIntakeTemplateVars).then((response) => {
  const data = response.data;
  console.log(data.intakeFormTemplate_insert);
});
```

### Using `CreateIntakeTemplate`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createIntakeTemplateRef, CreateIntakeTemplateVariables } from '@bridgeway/database';

// The `CreateIntakeTemplate` mutation requires an argument of type `CreateIntakeTemplateVariables`:
const createIntakeTemplateVars: CreateIntakeTemplateVariables = {
  orgId: ..., 
  name: ..., 
  fields: ..., 
  isActive: ..., 
};

// Call the `createIntakeTemplateRef()` function to get a reference to the mutation.
const ref = createIntakeTemplateRef(createIntakeTemplateVars);
// Variables can be defined inline as well.
const ref = createIntakeTemplateRef({ orgId: ..., name: ..., fields: ..., isActive: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createIntakeTemplateRef(dataConnect, createIntakeTemplateVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.intakeFormTemplate_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.intakeFormTemplate_insert);
});
```

## UpdateIntakeTemplate
You can execute the `UpdateIntakeTemplate` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
updateIntakeTemplate(vars: UpdateIntakeTemplateVariables): MutationPromise<UpdateIntakeTemplateData, UpdateIntakeTemplateVariables>;

interface UpdateIntakeTemplateRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateIntakeTemplateVariables): MutationRef<UpdateIntakeTemplateData, UpdateIntakeTemplateVariables>;
}
export const updateIntakeTemplateRef: UpdateIntakeTemplateRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateIntakeTemplate(dc: DataConnect, vars: UpdateIntakeTemplateVariables): MutationPromise<UpdateIntakeTemplateData, UpdateIntakeTemplateVariables>;

interface UpdateIntakeTemplateRef {
  ...
  (dc: DataConnect, vars: UpdateIntakeTemplateVariables): MutationRef<UpdateIntakeTemplateData, UpdateIntakeTemplateVariables>;
}
export const updateIntakeTemplateRef: UpdateIntakeTemplateRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateIntakeTemplateRef:
```typescript
const name = updateIntakeTemplateRef.operationName;
console.log(name);
```

### Variables
The `UpdateIntakeTemplate` mutation requires an argument of type `UpdateIntakeTemplateVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateIntakeTemplateVariables {
  id: UUIDString;
  name: string;
  fields: unknown;
  isActive: boolean;
}
```
### Return Type
Recall that executing the `UpdateIntakeTemplate` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateIntakeTemplateData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateIntakeTemplateData {
  intakeFormTemplate_update?: IntakeFormTemplate_Key | null;
}
```
### Using `UpdateIntakeTemplate`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateIntakeTemplate, UpdateIntakeTemplateVariables } from '@bridgeway/database';

// The `UpdateIntakeTemplate` mutation requires an argument of type `UpdateIntakeTemplateVariables`:
const updateIntakeTemplateVars: UpdateIntakeTemplateVariables = {
  id: ..., 
  name: ..., 
  fields: ..., 
  isActive: ..., 
};

// Call the `updateIntakeTemplate()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateIntakeTemplate(updateIntakeTemplateVars);
// Variables can be defined inline as well.
const { data } = await updateIntakeTemplate({ id: ..., name: ..., fields: ..., isActive: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateIntakeTemplate(dataConnect, updateIntakeTemplateVars);

console.log(data.intakeFormTemplate_update);

// Or, you can use the `Promise` API.
updateIntakeTemplate(updateIntakeTemplateVars).then((response) => {
  const data = response.data;
  console.log(data.intakeFormTemplate_update);
});
```

### Using `UpdateIntakeTemplate`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateIntakeTemplateRef, UpdateIntakeTemplateVariables } from '@bridgeway/database';

// The `UpdateIntakeTemplate` mutation requires an argument of type `UpdateIntakeTemplateVariables`:
const updateIntakeTemplateVars: UpdateIntakeTemplateVariables = {
  id: ..., 
  name: ..., 
  fields: ..., 
  isActive: ..., 
};

// Call the `updateIntakeTemplateRef()` function to get a reference to the mutation.
const ref = updateIntakeTemplateRef(updateIntakeTemplateVars);
// Variables can be defined inline as well.
const ref = updateIntakeTemplateRef({ id: ..., name: ..., fields: ..., isActive: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateIntakeTemplateRef(dataConnect, updateIntakeTemplateVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.intakeFormTemplate_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.intakeFormTemplate_update);
});
```

## DeleteIntakeTemplate
You can execute the `DeleteIntakeTemplate` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
deleteIntakeTemplate(vars: DeleteIntakeTemplateVariables): MutationPromise<DeleteIntakeTemplateData, DeleteIntakeTemplateVariables>;

interface DeleteIntakeTemplateRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteIntakeTemplateVariables): MutationRef<DeleteIntakeTemplateData, DeleteIntakeTemplateVariables>;
}
export const deleteIntakeTemplateRef: DeleteIntakeTemplateRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteIntakeTemplate(dc: DataConnect, vars: DeleteIntakeTemplateVariables): MutationPromise<DeleteIntakeTemplateData, DeleteIntakeTemplateVariables>;

interface DeleteIntakeTemplateRef {
  ...
  (dc: DataConnect, vars: DeleteIntakeTemplateVariables): MutationRef<DeleteIntakeTemplateData, DeleteIntakeTemplateVariables>;
}
export const deleteIntakeTemplateRef: DeleteIntakeTemplateRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteIntakeTemplateRef:
```typescript
const name = deleteIntakeTemplateRef.operationName;
console.log(name);
```

### Variables
The `DeleteIntakeTemplate` mutation requires an argument of type `DeleteIntakeTemplateVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteIntakeTemplateVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteIntakeTemplate` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteIntakeTemplateData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteIntakeTemplateData {
  intakeFormTemplate_delete?: IntakeFormTemplate_Key | null;
}
```
### Using `DeleteIntakeTemplate`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteIntakeTemplate, DeleteIntakeTemplateVariables } from '@bridgeway/database';

// The `DeleteIntakeTemplate` mutation requires an argument of type `DeleteIntakeTemplateVariables`:
const deleteIntakeTemplateVars: DeleteIntakeTemplateVariables = {
  id: ..., 
};

// Call the `deleteIntakeTemplate()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteIntakeTemplate(deleteIntakeTemplateVars);
// Variables can be defined inline as well.
const { data } = await deleteIntakeTemplate({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteIntakeTemplate(dataConnect, deleteIntakeTemplateVars);

console.log(data.intakeFormTemplate_delete);

// Or, you can use the `Promise` API.
deleteIntakeTemplate(deleteIntakeTemplateVars).then((response) => {
  const data = response.data;
  console.log(data.intakeFormTemplate_delete);
});
```

### Using `DeleteIntakeTemplate`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteIntakeTemplateRef, DeleteIntakeTemplateVariables } from '@bridgeway/database';

// The `DeleteIntakeTemplate` mutation requires an argument of type `DeleteIntakeTemplateVariables`:
const deleteIntakeTemplateVars: DeleteIntakeTemplateVariables = {
  id: ..., 
};

// Call the `deleteIntakeTemplateRef()` function to get a reference to the mutation.
const ref = deleteIntakeTemplateRef(deleteIntakeTemplateVars);
// Variables can be defined inline as well.
const ref = deleteIntakeTemplateRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteIntakeTemplateRef(dataConnect, deleteIntakeTemplateVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.intakeFormTemplate_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.intakeFormTemplate_delete);
});
```

## UpdateService
You can execute the `UpdateService` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
updateService(vars: UpdateServiceVariables): MutationPromise<UpdateServiceData, UpdateServiceVariables>;

interface UpdateServiceRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateServiceVariables): MutationRef<UpdateServiceData, UpdateServiceVariables>;
}
export const updateServiceRef: UpdateServiceRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateService(dc: DataConnect, vars: UpdateServiceVariables): MutationPromise<UpdateServiceData, UpdateServiceVariables>;

interface UpdateServiceRef {
  ...
  (dc: DataConnect, vars: UpdateServiceVariables): MutationRef<UpdateServiceData, UpdateServiceVariables>;
}
export const updateServiceRef: UpdateServiceRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateServiceRef:
```typescript
const name = updateServiceRef.operationName;
console.log(name);
```

### Variables
The `UpdateService` mutation requires an argument of type `UpdateServiceVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateServiceVariables {
  id: UUIDString;
  name: string;
  durationMinutes: number;
  price: number;
}
```
### Return Type
Recall that executing the `UpdateService` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateServiceData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateServiceData {
  service_update?: Service_Key | null;
}
```
### Using `UpdateService`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateService, UpdateServiceVariables } from '@bridgeway/database';

// The `UpdateService` mutation requires an argument of type `UpdateServiceVariables`:
const updateServiceVars: UpdateServiceVariables = {
  id: ..., 
  name: ..., 
  durationMinutes: ..., 
  price: ..., 
};

// Call the `updateService()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateService(updateServiceVars);
// Variables can be defined inline as well.
const { data } = await updateService({ id: ..., name: ..., durationMinutes: ..., price: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateService(dataConnect, updateServiceVars);

console.log(data.service_update);

// Or, you can use the `Promise` API.
updateService(updateServiceVars).then((response) => {
  const data = response.data;
  console.log(data.service_update);
});
```

### Using `UpdateService`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateServiceRef, UpdateServiceVariables } from '@bridgeway/database';

// The `UpdateService` mutation requires an argument of type `UpdateServiceVariables`:
const updateServiceVars: UpdateServiceVariables = {
  id: ..., 
  name: ..., 
  durationMinutes: ..., 
  price: ..., 
};

// Call the `updateServiceRef()` function to get a reference to the mutation.
const ref = updateServiceRef(updateServiceVars);
// Variables can be defined inline as well.
const ref = updateServiceRef({ id: ..., name: ..., durationMinutes: ..., price: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateServiceRef(dataConnect, updateServiceVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.service_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.service_update);
});
```

## ToggleServiceArchive
You can execute the `ToggleServiceArchive` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
toggleServiceArchive(vars: ToggleServiceArchiveVariables): MutationPromise<ToggleServiceArchiveData, ToggleServiceArchiveVariables>;

interface ToggleServiceArchiveRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ToggleServiceArchiveVariables): MutationRef<ToggleServiceArchiveData, ToggleServiceArchiveVariables>;
}
export const toggleServiceArchiveRef: ToggleServiceArchiveRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
toggleServiceArchive(dc: DataConnect, vars: ToggleServiceArchiveVariables): MutationPromise<ToggleServiceArchiveData, ToggleServiceArchiveVariables>;

interface ToggleServiceArchiveRef {
  ...
  (dc: DataConnect, vars: ToggleServiceArchiveVariables): MutationRef<ToggleServiceArchiveData, ToggleServiceArchiveVariables>;
}
export const toggleServiceArchiveRef: ToggleServiceArchiveRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the toggleServiceArchiveRef:
```typescript
const name = toggleServiceArchiveRef.operationName;
console.log(name);
```

### Variables
The `ToggleServiceArchive` mutation requires an argument of type `ToggleServiceArchiveVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ToggleServiceArchiveVariables {
  id: UUIDString;
  isArchived: boolean;
}
```
### Return Type
Recall that executing the `ToggleServiceArchive` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ToggleServiceArchiveData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ToggleServiceArchiveData {
  service_update?: Service_Key | null;
}
```
### Using `ToggleServiceArchive`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, toggleServiceArchive, ToggleServiceArchiveVariables } from '@bridgeway/database';

// The `ToggleServiceArchive` mutation requires an argument of type `ToggleServiceArchiveVariables`:
const toggleServiceArchiveVars: ToggleServiceArchiveVariables = {
  id: ..., 
  isArchived: ..., 
};

// Call the `toggleServiceArchive()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await toggleServiceArchive(toggleServiceArchiveVars);
// Variables can be defined inline as well.
const { data } = await toggleServiceArchive({ id: ..., isArchived: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await toggleServiceArchive(dataConnect, toggleServiceArchiveVars);

console.log(data.service_update);

// Or, you can use the `Promise` API.
toggleServiceArchive(toggleServiceArchiveVars).then((response) => {
  const data = response.data;
  console.log(data.service_update);
});
```

### Using `ToggleServiceArchive`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, toggleServiceArchiveRef, ToggleServiceArchiveVariables } from '@bridgeway/database';

// The `ToggleServiceArchive` mutation requires an argument of type `ToggleServiceArchiveVariables`:
const toggleServiceArchiveVars: ToggleServiceArchiveVariables = {
  id: ..., 
  isArchived: ..., 
};

// Call the `toggleServiceArchiveRef()` function to get a reference to the mutation.
const ref = toggleServiceArchiveRef(toggleServiceArchiveVars);
// Variables can be defined inline as well.
const ref = toggleServiceArchiveRef({ id: ..., isArchived: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = toggleServiceArchiveRef(dataConnect, toggleServiceArchiveVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.service_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.service_update);
});
```

## CreateMarketingTrigger
You can execute the `CreateMarketingTrigger` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
createMarketingTrigger(vars: CreateMarketingTriggerVariables): MutationPromise<CreateMarketingTriggerData, CreateMarketingTriggerVariables>;

interface CreateMarketingTriggerRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateMarketingTriggerVariables): MutationRef<CreateMarketingTriggerData, CreateMarketingTriggerVariables>;
}
export const createMarketingTriggerRef: CreateMarketingTriggerRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createMarketingTrigger(dc: DataConnect, vars: CreateMarketingTriggerVariables): MutationPromise<CreateMarketingTriggerData, CreateMarketingTriggerVariables>;

interface CreateMarketingTriggerRef {
  ...
  (dc: DataConnect, vars: CreateMarketingTriggerVariables): MutationRef<CreateMarketingTriggerData, CreateMarketingTriggerVariables>;
}
export const createMarketingTriggerRef: CreateMarketingTriggerRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createMarketingTriggerRef:
```typescript
const name = createMarketingTriggerRef.operationName;
console.log(name);
```

### Variables
The `CreateMarketingTrigger` mutation requires an argument of type `CreateMarketingTriggerVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateMarketingTriggerVariables {
  orgId: UUIDString;
  triggerId: string;
  title: string;
  description?: string | null;
  channel: string;
  enabled: boolean;
  delayValue: number;
  delayUnit: string;
  message: string;
}
```
### Return Type
Recall that executing the `CreateMarketingTrigger` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateMarketingTriggerData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateMarketingTriggerData {
  marketingTrigger_insert: MarketingTrigger_Key;
}
```
### Using `CreateMarketingTrigger`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createMarketingTrigger, CreateMarketingTriggerVariables } from '@bridgeway/database';

// The `CreateMarketingTrigger` mutation requires an argument of type `CreateMarketingTriggerVariables`:
const createMarketingTriggerVars: CreateMarketingTriggerVariables = {
  orgId: ..., 
  triggerId: ..., 
  title: ..., 
  description: ..., // optional
  channel: ..., 
  enabled: ..., 
  delayValue: ..., 
  delayUnit: ..., 
  message: ..., 
};

// Call the `createMarketingTrigger()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createMarketingTrigger(createMarketingTriggerVars);
// Variables can be defined inline as well.
const { data } = await createMarketingTrigger({ orgId: ..., triggerId: ..., title: ..., description: ..., channel: ..., enabled: ..., delayValue: ..., delayUnit: ..., message: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createMarketingTrigger(dataConnect, createMarketingTriggerVars);

console.log(data.marketingTrigger_insert);

// Or, you can use the `Promise` API.
createMarketingTrigger(createMarketingTriggerVars).then((response) => {
  const data = response.data;
  console.log(data.marketingTrigger_insert);
});
```

### Using `CreateMarketingTrigger`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createMarketingTriggerRef, CreateMarketingTriggerVariables } from '@bridgeway/database';

// The `CreateMarketingTrigger` mutation requires an argument of type `CreateMarketingTriggerVariables`:
const createMarketingTriggerVars: CreateMarketingTriggerVariables = {
  orgId: ..., 
  triggerId: ..., 
  title: ..., 
  description: ..., // optional
  channel: ..., 
  enabled: ..., 
  delayValue: ..., 
  delayUnit: ..., 
  message: ..., 
};

// Call the `createMarketingTriggerRef()` function to get a reference to the mutation.
const ref = createMarketingTriggerRef(createMarketingTriggerVars);
// Variables can be defined inline as well.
const ref = createMarketingTriggerRef({ orgId: ..., triggerId: ..., title: ..., description: ..., channel: ..., enabled: ..., delayValue: ..., delayUnit: ..., message: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createMarketingTriggerRef(dataConnect, createMarketingTriggerVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.marketingTrigger_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.marketingTrigger_insert);
});
```

## UpdateMarketingTrigger
You can execute the `UpdateMarketingTrigger` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
updateMarketingTrigger(vars: UpdateMarketingTriggerVariables): MutationPromise<UpdateMarketingTriggerData, UpdateMarketingTriggerVariables>;

interface UpdateMarketingTriggerRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateMarketingTriggerVariables): MutationRef<UpdateMarketingTriggerData, UpdateMarketingTriggerVariables>;
}
export const updateMarketingTriggerRef: UpdateMarketingTriggerRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateMarketingTrigger(dc: DataConnect, vars: UpdateMarketingTriggerVariables): MutationPromise<UpdateMarketingTriggerData, UpdateMarketingTriggerVariables>;

interface UpdateMarketingTriggerRef {
  ...
  (dc: DataConnect, vars: UpdateMarketingTriggerVariables): MutationRef<UpdateMarketingTriggerData, UpdateMarketingTriggerVariables>;
}
export const updateMarketingTriggerRef: UpdateMarketingTriggerRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateMarketingTriggerRef:
```typescript
const name = updateMarketingTriggerRef.operationName;
console.log(name);
```

### Variables
The `UpdateMarketingTrigger` mutation requires an argument of type `UpdateMarketingTriggerVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateMarketingTriggerVariables {
  id: UUIDString;
  channel: string;
  enabled: boolean;
  delayValue: number;
  delayUnit: string;
  message: string;
}
```
### Return Type
Recall that executing the `UpdateMarketingTrigger` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateMarketingTriggerData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateMarketingTriggerData {
  marketingTrigger_update?: MarketingTrigger_Key | null;
}
```
### Using `UpdateMarketingTrigger`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateMarketingTrigger, UpdateMarketingTriggerVariables } from '@bridgeway/database';

// The `UpdateMarketingTrigger` mutation requires an argument of type `UpdateMarketingTriggerVariables`:
const updateMarketingTriggerVars: UpdateMarketingTriggerVariables = {
  id: ..., 
  channel: ..., 
  enabled: ..., 
  delayValue: ..., 
  delayUnit: ..., 
  message: ..., 
};

// Call the `updateMarketingTrigger()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateMarketingTrigger(updateMarketingTriggerVars);
// Variables can be defined inline as well.
const { data } = await updateMarketingTrigger({ id: ..., channel: ..., enabled: ..., delayValue: ..., delayUnit: ..., message: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateMarketingTrigger(dataConnect, updateMarketingTriggerVars);

console.log(data.marketingTrigger_update);

// Or, you can use the `Promise` API.
updateMarketingTrigger(updateMarketingTriggerVars).then((response) => {
  const data = response.data;
  console.log(data.marketingTrigger_update);
});
```

### Using `UpdateMarketingTrigger`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateMarketingTriggerRef, UpdateMarketingTriggerVariables } from '@bridgeway/database';

// The `UpdateMarketingTrigger` mutation requires an argument of type `UpdateMarketingTriggerVariables`:
const updateMarketingTriggerVars: UpdateMarketingTriggerVariables = {
  id: ..., 
  channel: ..., 
  enabled: ..., 
  delayValue: ..., 
  delayUnit: ..., 
  message: ..., 
};

// Call the `updateMarketingTriggerRef()` function to get a reference to the mutation.
const ref = updateMarketingTriggerRef(updateMarketingTriggerVars);
// Variables can be defined inline as well.
const ref = updateMarketingTriggerRef({ id: ..., channel: ..., enabled: ..., delayValue: ..., delayUnit: ..., message: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateMarketingTriggerRef(dataConnect, updateMarketingTriggerVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.marketingTrigger_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.marketingTrigger_update);
});
```

## UpsertNotificationSettings
You can execute the `UpsertNotificationSettings` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
upsertNotificationSettings(vars: UpsertNotificationSettingsVariables): MutationPromise<UpsertNotificationSettingsData, UpsertNotificationSettingsVariables>;

interface UpsertNotificationSettingsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertNotificationSettingsVariables): MutationRef<UpsertNotificationSettingsData, UpsertNotificationSettingsVariables>;
}
export const upsertNotificationSettingsRef: UpsertNotificationSettingsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
upsertNotificationSettings(dc: DataConnect, vars: UpsertNotificationSettingsVariables): MutationPromise<UpsertNotificationSettingsData, UpsertNotificationSettingsVariables>;

interface UpsertNotificationSettingsRef {
  ...
  (dc: DataConnect, vars: UpsertNotificationSettingsVariables): MutationRef<UpsertNotificationSettingsData, UpsertNotificationSettingsVariables>;
}
export const upsertNotificationSettingsRef: UpsertNotificationSettingsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the upsertNotificationSettingsRef:
```typescript
const name = upsertNotificationSettingsRef.operationName;
console.log(name);
```

### Variables
The `UpsertNotificationSettings` mutation requires an argument of type `UpsertNotificationSettingsVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpsertNotificationSettingsVariables {
  orgId: UUIDString;
  smsEnabled: boolean;
  emailEnabled: boolean;
  reminder24h: boolean;
  reminder2h: boolean;
}
```
### Return Type
Recall that executing the `UpsertNotificationSettings` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpsertNotificationSettingsData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpsertNotificationSettingsData {
  notificationSetting_upsert: NotificationSetting_Key;
}
```
### Using `UpsertNotificationSettings`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, upsertNotificationSettings, UpsertNotificationSettingsVariables } from '@bridgeway/database';

// The `UpsertNotificationSettings` mutation requires an argument of type `UpsertNotificationSettingsVariables`:
const upsertNotificationSettingsVars: UpsertNotificationSettingsVariables = {
  orgId: ..., 
  smsEnabled: ..., 
  emailEnabled: ..., 
  reminder24h: ..., 
  reminder2h: ..., 
};

// Call the `upsertNotificationSettings()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await upsertNotificationSettings(upsertNotificationSettingsVars);
// Variables can be defined inline as well.
const { data } = await upsertNotificationSettings({ orgId: ..., smsEnabled: ..., emailEnabled: ..., reminder24h: ..., reminder2h: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await upsertNotificationSettings(dataConnect, upsertNotificationSettingsVars);

console.log(data.notificationSetting_upsert);

// Or, you can use the `Promise` API.
upsertNotificationSettings(upsertNotificationSettingsVars).then((response) => {
  const data = response.data;
  console.log(data.notificationSetting_upsert);
});
```

### Using `UpsertNotificationSettings`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, upsertNotificationSettingsRef, UpsertNotificationSettingsVariables } from '@bridgeway/database';

// The `UpsertNotificationSettings` mutation requires an argument of type `UpsertNotificationSettingsVariables`:
const upsertNotificationSettingsVars: UpsertNotificationSettingsVariables = {
  orgId: ..., 
  smsEnabled: ..., 
  emailEnabled: ..., 
  reminder24h: ..., 
  reminder2h: ..., 
};

// Call the `upsertNotificationSettingsRef()` function to get a reference to the mutation.
const ref = upsertNotificationSettingsRef(upsertNotificationSettingsVars);
// Variables can be defined inline as well.
const ref = upsertNotificationSettingsRef({ orgId: ..., smsEnabled: ..., emailEnabled: ..., reminder24h: ..., reminder2h: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = upsertNotificationSettingsRef(dataConnect, upsertNotificationSettingsVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.notificationSetting_upsert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.notificationSetting_upsert);
});
```

## UpdateOrgPatientCheckin
You can execute the `UpdateOrgPatientCheckin` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
updateOrgPatientCheckin(vars: UpdateOrgPatientCheckinVariables): MutationPromise<UpdateOrgPatientCheckinData, UpdateOrgPatientCheckinVariables>;

interface UpdateOrgPatientCheckinRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateOrgPatientCheckinVariables): MutationRef<UpdateOrgPatientCheckinData, UpdateOrgPatientCheckinVariables>;
}
export const updateOrgPatientCheckinRef: UpdateOrgPatientCheckinRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateOrgPatientCheckin(dc: DataConnect, vars: UpdateOrgPatientCheckinVariables): MutationPromise<UpdateOrgPatientCheckinData, UpdateOrgPatientCheckinVariables>;

interface UpdateOrgPatientCheckinRef {
  ...
  (dc: DataConnect, vars: UpdateOrgPatientCheckinVariables): MutationRef<UpdateOrgPatientCheckinData, UpdateOrgPatientCheckinVariables>;
}
export const updateOrgPatientCheckinRef: UpdateOrgPatientCheckinRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateOrgPatientCheckinRef:
```typescript
const name = updateOrgPatientCheckinRef.operationName;
console.log(name);
```

### Variables
The `UpdateOrgPatientCheckin` mutation requires an argument of type `UpdateOrgPatientCheckinVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateOrgPatientCheckinVariables {
  id: UUIDString;
  patientCheckinEnabled: boolean;
}
```
### Return Type
Recall that executing the `UpdateOrgPatientCheckin` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateOrgPatientCheckinData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateOrgPatientCheckinData {
  org_update?: Org_Key | null;
}
```
### Using `UpdateOrgPatientCheckin`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateOrgPatientCheckin, UpdateOrgPatientCheckinVariables } from '@bridgeway/database';

// The `UpdateOrgPatientCheckin` mutation requires an argument of type `UpdateOrgPatientCheckinVariables`:
const updateOrgPatientCheckinVars: UpdateOrgPatientCheckinVariables = {
  id: ..., 
  patientCheckinEnabled: ..., 
};

// Call the `updateOrgPatientCheckin()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateOrgPatientCheckin(updateOrgPatientCheckinVars);
// Variables can be defined inline as well.
const { data } = await updateOrgPatientCheckin({ id: ..., patientCheckinEnabled: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateOrgPatientCheckin(dataConnect, updateOrgPatientCheckinVars);

console.log(data.org_update);

// Or, you can use the `Promise` API.
updateOrgPatientCheckin(updateOrgPatientCheckinVars).then((response) => {
  const data = response.data;
  console.log(data.org_update);
});
```

### Using `UpdateOrgPatientCheckin`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateOrgPatientCheckinRef, UpdateOrgPatientCheckinVariables } from '@bridgeway/database';

// The `UpdateOrgPatientCheckin` mutation requires an argument of type `UpdateOrgPatientCheckinVariables`:
const updateOrgPatientCheckinVars: UpdateOrgPatientCheckinVariables = {
  id: ..., 
  patientCheckinEnabled: ..., 
};

// Call the `updateOrgPatientCheckinRef()` function to get a reference to the mutation.
const ref = updateOrgPatientCheckinRef(updateOrgPatientCheckinVars);
// Variables can be defined inline as well.
const ref = updateOrgPatientCheckinRef({ id: ..., patientCheckinEnabled: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateOrgPatientCheckinRef(dataConnect, updateOrgPatientCheckinVars);

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

## CreatePackageTemplate
You can execute the `CreatePackageTemplate` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
createPackageTemplate(vars: CreatePackageTemplateVariables): MutationPromise<CreatePackageTemplateData, CreatePackageTemplateVariables>;

interface CreatePackageTemplateRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreatePackageTemplateVariables): MutationRef<CreatePackageTemplateData, CreatePackageTemplateVariables>;
}
export const createPackageTemplateRef: CreatePackageTemplateRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createPackageTemplate(dc: DataConnect, vars: CreatePackageTemplateVariables): MutationPromise<CreatePackageTemplateData, CreatePackageTemplateVariables>;

interface CreatePackageTemplateRef {
  ...
  (dc: DataConnect, vars: CreatePackageTemplateVariables): MutationRef<CreatePackageTemplateData, CreatePackageTemplateVariables>;
}
export const createPackageTemplateRef: CreatePackageTemplateRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createPackageTemplateRef:
```typescript
const name = createPackageTemplateRef.operationName;
console.log(name);
```

### Variables
The `CreatePackageTemplate` mutation requires an argument of type `CreatePackageTemplateVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreatePackageTemplateVariables {
  orgId: UUIDString;
  name: string;
  type: string;
  serviceId?: UUIDString | null;
  sessionCount?: number | null;
  price: number;
  billingInterval?: string | null;
  expiryDays?: number | null;
  isActive: boolean;
}
```
### Return Type
Recall that executing the `CreatePackageTemplate` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreatePackageTemplateData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreatePackageTemplateData {
  packageTemplate_insert: PackageTemplate_Key;
}
```
### Using `CreatePackageTemplate`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createPackageTemplate, CreatePackageTemplateVariables } from '@bridgeway/database';

// The `CreatePackageTemplate` mutation requires an argument of type `CreatePackageTemplateVariables`:
const createPackageTemplateVars: CreatePackageTemplateVariables = {
  orgId: ..., 
  name: ..., 
  type: ..., 
  serviceId: ..., // optional
  sessionCount: ..., // optional
  price: ..., 
  billingInterval: ..., // optional
  expiryDays: ..., // optional
  isActive: ..., 
};

// Call the `createPackageTemplate()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createPackageTemplate(createPackageTemplateVars);
// Variables can be defined inline as well.
const { data } = await createPackageTemplate({ orgId: ..., name: ..., type: ..., serviceId: ..., sessionCount: ..., price: ..., billingInterval: ..., expiryDays: ..., isActive: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createPackageTemplate(dataConnect, createPackageTemplateVars);

console.log(data.packageTemplate_insert);

// Or, you can use the `Promise` API.
createPackageTemplate(createPackageTemplateVars).then((response) => {
  const data = response.data;
  console.log(data.packageTemplate_insert);
});
```

### Using `CreatePackageTemplate`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createPackageTemplateRef, CreatePackageTemplateVariables } from '@bridgeway/database';

// The `CreatePackageTemplate` mutation requires an argument of type `CreatePackageTemplateVariables`:
const createPackageTemplateVars: CreatePackageTemplateVariables = {
  orgId: ..., 
  name: ..., 
  type: ..., 
  serviceId: ..., // optional
  sessionCount: ..., // optional
  price: ..., 
  billingInterval: ..., // optional
  expiryDays: ..., // optional
  isActive: ..., 
};

// Call the `createPackageTemplateRef()` function to get a reference to the mutation.
const ref = createPackageTemplateRef(createPackageTemplateVars);
// Variables can be defined inline as well.
const ref = createPackageTemplateRef({ orgId: ..., name: ..., type: ..., serviceId: ..., sessionCount: ..., price: ..., billingInterval: ..., expiryDays: ..., isActive: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createPackageTemplateRef(dataConnect, createPackageTemplateVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.packageTemplate_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.packageTemplate_insert);
});
```

## UpdatePackageTemplate
You can execute the `UpdatePackageTemplate` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
updatePackageTemplate(vars: UpdatePackageTemplateVariables): MutationPromise<UpdatePackageTemplateData, UpdatePackageTemplateVariables>;

interface UpdatePackageTemplateRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdatePackageTemplateVariables): MutationRef<UpdatePackageTemplateData, UpdatePackageTemplateVariables>;
}
export const updatePackageTemplateRef: UpdatePackageTemplateRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updatePackageTemplate(dc: DataConnect, vars: UpdatePackageTemplateVariables): MutationPromise<UpdatePackageTemplateData, UpdatePackageTemplateVariables>;

interface UpdatePackageTemplateRef {
  ...
  (dc: DataConnect, vars: UpdatePackageTemplateVariables): MutationRef<UpdatePackageTemplateData, UpdatePackageTemplateVariables>;
}
export const updatePackageTemplateRef: UpdatePackageTemplateRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updatePackageTemplateRef:
```typescript
const name = updatePackageTemplateRef.operationName;
console.log(name);
```

### Variables
The `UpdatePackageTemplate` mutation requires an argument of type `UpdatePackageTemplateVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdatePackageTemplateVariables {
  id: UUIDString;
  name: string;
  type: string;
  serviceId?: UUIDString | null;
  sessionCount?: number | null;
  price: number;
  billingInterval?: string | null;
  expiryDays?: number | null;
  isActive: boolean;
}
```
### Return Type
Recall that executing the `UpdatePackageTemplate` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdatePackageTemplateData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdatePackageTemplateData {
  packageTemplate_update?: PackageTemplate_Key | null;
}
```
### Using `UpdatePackageTemplate`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updatePackageTemplate, UpdatePackageTemplateVariables } from '@bridgeway/database';

// The `UpdatePackageTemplate` mutation requires an argument of type `UpdatePackageTemplateVariables`:
const updatePackageTemplateVars: UpdatePackageTemplateVariables = {
  id: ..., 
  name: ..., 
  type: ..., 
  serviceId: ..., // optional
  sessionCount: ..., // optional
  price: ..., 
  billingInterval: ..., // optional
  expiryDays: ..., // optional
  isActive: ..., 
};

// Call the `updatePackageTemplate()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updatePackageTemplate(updatePackageTemplateVars);
// Variables can be defined inline as well.
const { data } = await updatePackageTemplate({ id: ..., name: ..., type: ..., serviceId: ..., sessionCount: ..., price: ..., billingInterval: ..., expiryDays: ..., isActive: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updatePackageTemplate(dataConnect, updatePackageTemplateVars);

console.log(data.packageTemplate_update);

// Or, you can use the `Promise` API.
updatePackageTemplate(updatePackageTemplateVars).then((response) => {
  const data = response.data;
  console.log(data.packageTemplate_update);
});
```

### Using `UpdatePackageTemplate`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updatePackageTemplateRef, UpdatePackageTemplateVariables } from '@bridgeway/database';

// The `UpdatePackageTemplate` mutation requires an argument of type `UpdatePackageTemplateVariables`:
const updatePackageTemplateVars: UpdatePackageTemplateVariables = {
  id: ..., 
  name: ..., 
  type: ..., 
  serviceId: ..., // optional
  sessionCount: ..., // optional
  price: ..., 
  billingInterval: ..., // optional
  expiryDays: ..., // optional
  isActive: ..., 
};

// Call the `updatePackageTemplateRef()` function to get a reference to the mutation.
const ref = updatePackageTemplateRef(updatePackageTemplateVars);
// Variables can be defined inline as well.
const ref = updatePackageTemplateRef({ id: ..., name: ..., type: ..., serviceId: ..., sessionCount: ..., price: ..., billingInterval: ..., expiryDays: ..., isActive: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updatePackageTemplateRef(dataConnect, updatePackageTemplateVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.packageTemplate_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.packageTemplate_update);
});
```

## TogglePackageTemplateActive
You can execute the `TogglePackageTemplateActive` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
togglePackageTemplateActive(vars: TogglePackageTemplateActiveVariables): MutationPromise<TogglePackageTemplateActiveData, TogglePackageTemplateActiveVariables>;

interface TogglePackageTemplateActiveRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: TogglePackageTemplateActiveVariables): MutationRef<TogglePackageTemplateActiveData, TogglePackageTemplateActiveVariables>;
}
export const togglePackageTemplateActiveRef: TogglePackageTemplateActiveRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
togglePackageTemplateActive(dc: DataConnect, vars: TogglePackageTemplateActiveVariables): MutationPromise<TogglePackageTemplateActiveData, TogglePackageTemplateActiveVariables>;

interface TogglePackageTemplateActiveRef {
  ...
  (dc: DataConnect, vars: TogglePackageTemplateActiveVariables): MutationRef<TogglePackageTemplateActiveData, TogglePackageTemplateActiveVariables>;
}
export const togglePackageTemplateActiveRef: TogglePackageTemplateActiveRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the togglePackageTemplateActiveRef:
```typescript
const name = togglePackageTemplateActiveRef.operationName;
console.log(name);
```

### Variables
The `TogglePackageTemplateActive` mutation requires an argument of type `TogglePackageTemplateActiveVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface TogglePackageTemplateActiveVariables {
  id: UUIDString;
  isActive: boolean;
}
```
### Return Type
Recall that executing the `TogglePackageTemplateActive` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `TogglePackageTemplateActiveData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface TogglePackageTemplateActiveData {
  packageTemplate_update?: PackageTemplate_Key | null;
}
```
### Using `TogglePackageTemplateActive`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, togglePackageTemplateActive, TogglePackageTemplateActiveVariables } from '@bridgeway/database';

// The `TogglePackageTemplateActive` mutation requires an argument of type `TogglePackageTemplateActiveVariables`:
const togglePackageTemplateActiveVars: TogglePackageTemplateActiveVariables = {
  id: ..., 
  isActive: ..., 
};

// Call the `togglePackageTemplateActive()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await togglePackageTemplateActive(togglePackageTemplateActiveVars);
// Variables can be defined inline as well.
const { data } = await togglePackageTemplateActive({ id: ..., isActive: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await togglePackageTemplateActive(dataConnect, togglePackageTemplateActiveVars);

console.log(data.packageTemplate_update);

// Or, you can use the `Promise` API.
togglePackageTemplateActive(togglePackageTemplateActiveVars).then((response) => {
  const data = response.data;
  console.log(data.packageTemplate_update);
});
```

### Using `TogglePackageTemplateActive`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, togglePackageTemplateActiveRef, TogglePackageTemplateActiveVariables } from '@bridgeway/database';

// The `TogglePackageTemplateActive` mutation requires an argument of type `TogglePackageTemplateActiveVariables`:
const togglePackageTemplateActiveVars: TogglePackageTemplateActiveVariables = {
  id: ..., 
  isActive: ..., 
};

// Call the `togglePackageTemplateActiveRef()` function to get a reference to the mutation.
const ref = togglePackageTemplateActiveRef(togglePackageTemplateActiveVars);
// Variables can be defined inline as well.
const ref = togglePackageTemplateActiveRef({ id: ..., isActive: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = togglePackageTemplateActiveRef(dataConnect, togglePackageTemplateActiveVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.packageTemplate_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.packageTemplate_update);
});
```

