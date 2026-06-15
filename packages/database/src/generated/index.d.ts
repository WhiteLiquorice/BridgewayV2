import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, ExecuteQueryOptions, MutationRef, MutationPromise } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface ActivityLog_Key {
  id: UUIDString;
  __typename?: 'ActivityLog_Key';
}

export interface Announcement_Key {
  id: UUIDString;
  __typename?: 'Announcement_Key';
}

export interface Appointment_Key {
  id: UUIDString;
  __typename?: 'Appointment_Key';
}

export interface Booking_Key {
  id: UUIDString;
  __typename?: 'Booking_Key';
}

export interface ClassRegistration_Key {
  id: UUIDString;
  __typename?: 'ClassRegistration_Key';
}

export interface Class_Key {
  id: UUIDString;
  __typename?: 'Class_Key';
}

export interface ClientPackage_Key {
  id: UUIDString;
  __typename?: 'ClientPackage_Key';
}

export interface Client_Key {
  id: UUIDString;
  __typename?: 'Client_Key';
}

export interface CreateAppointmentData {
  appointment_insert: Appointment_Key;
}

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

export interface CreateBookingData {
  booking_insert: Booking_Key;
}

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

export interface CreateClientData {
  client_insert: Client_Key;
}

export interface CreateClientPackageData {
  clientPackage_insert: ClientPackage_Key;
}

export interface CreateClientPackageVariables {
  orgId: UUIDString;
  clientId: UUIDString;
  name: string;
  totalSessions: number;
  price: number;
  expiresAt?: TimestampString | null;
}

export interface CreateClientVariables {
  orgId: UUIDString;
  name: string;
  email?: string | null;
  phone?: string | null;
  dateOfBirth?: DateString | null;
  address?: string | null;
  notes?: string | null;
}

export interface CreateOrgData {
  org_insert: Org_Key;
}

export interface CreateOrgProfileData {
  profile_insert: Profile_Key;
}

export interface CreateOrgProfileVariables {
  orgId: UUIDString;
  fullName: string;
  email: string;
  role: string;
  commissionRatePercentage: number;
}

export interface CreateOrgVariables {
  name: string;
  subscriptionTier: string;
  stripePublishableKey?: string | null;
  email: string;
}

export interface CreateQueueEntryData {
  queueEntry_insert: QueueEntry_Key;
}

export interface CreateQueueEntryVariables {
  orgId: UUIDString;
  clientName: string;
  serviceId?: UUIDString | null;
  status: string;
  position: number;
}

export interface CreateServiceData {
  service_insert: Service_Key;
}

export interface CreateServiceVariables {
  orgId: UUIDString;
  name: string;
  description?: string | null;
  durationMinutes: number;
  price: number;
}

export interface DeleteQueueEntryData {
  queueEntry_delete?: QueueEntry_Key | null;
}

export interface DeleteQueueEntryVariables {
  id: UUIDString;
}

export interface Document_Key {
  id: UUIDString;
  __typename?: 'Document_Key';
}

export interface FloorZone_Key {
  id: UUIDString;
  __typename?: 'FloorZone_Key';
}

export interface GetActivePackageTemplatesData {
  packageTemplates: ({
    id: UUIDString;
    name: string;
    sessionCount?: number | null;
    price: number;
    expiryDays?: number | null;
  } & PackageTemplate_Key)[];
}

export interface GetActivePackageTemplatesVariables {
  orgId: UUIDString;
}

export interface GetActiveServicesData {
  services: ({
    id: UUIDString;
    name: string;
    price?: number | null;
    durationMinutes?: number | null;
  } & Service_Key)[];
}

export interface GetActiveServicesVariables {
  orgId: UUIDString;
}

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

export interface GetAdminDashboardStatsVariables {
  orgId: UUIDString;
  thirtyDaysAgo: TimestampString;
  sevenDaysAgo: TimestampString;
  todayStart: TimestampString;
  todayEnd: TimestampString;
}

export interface GetAppointmentsForDayData {
  appointments: ({
    scheduledAt: TimestampString;
    service?: {
      durationMinutes?: number | null;
    };
  })[];
}

export interface GetAppointmentsForDayVariables {
  orgId: UUIDString;
  startOfDay: TimestampString;
  endOfDay: TimestampString;
}

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

export interface GetBookingByIdVariables {
  id: UUIDString;
}

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

export interface GetBookingPageDataVariables {
  slug: string;
}

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

export interface GetClientAppointmentsVariables {
  clientId: UUIDString;
}

export interface GetClientByEmailData {
  clients: ({
    id: UUIDString;
    name: string;
    email?: string | null;
    phone?: string | null;
  } & Client_Key)[];
}

export interface GetClientByEmailVariables {
  orgId: UUIDString;
  email: string;
}

export interface GetClientByPhoneData {
  clients: ({
    id: UUIDString;
    name: string;
    email?: string | null;
    phone?: string | null;
  } & Client_Key)[];
}

export interface GetClientByPhoneVariables {
  orgId: UUIDString;
  phone: string;
}

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

export interface GetClientDetailVariables {
  id: UUIDString;
}

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

export interface GetInAppNotificationsVariables {
  orgId: UUIDString;
}

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

export interface GetOrgAppointmentsVariables {
  orgId: UUIDString;
}

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

export interface GetOrgClientsVariables {
  orgId: UUIDString;
}

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

export interface GetOrgProfilesVariables {
  orgId: UUIDString;
}

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

export interface GetOrgQueueVariables {
  orgId: UUIDString;
}

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

export interface GetOrgSettingsVariables {
  orgId: UUIDString;
}

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

export interface GetSlotsForDayVariables {
  orgId: UUIDString;
  start: TimestampString;
  end: TimestampString;
}

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

export interface GetUpcomingBookingsVariables {
  status: string;
  windowLo: DateString;
  windowHi: DateString;
  check24h?: boolean | null;
  check2h?: boolean | null;
}

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

export interface GetUpcomingOrgAppointmentsVariables {
  orgId: UUIDString;
}

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

export interface InAppNotification_Key {
  id: UUIDString;
  __typename?: 'InAppNotification_Key';
}

export interface IntakeFormSubmission_Key {
  id: UUIDString;
  __typename?: 'IntakeFormSubmission_Key';
}

export interface IntakeFormTemplate_Key {
  id: UUIDString;
  __typename?: 'IntakeFormTemplate_Key';
}

export interface LogActivityData {
  activityLog_insert: ActivityLog_Key;
}

export interface LogActivityVariables {
  orgId: UUIDString;
  userId?: string | null;
  action: string;
  entityType?: string | null;
  entityId?: UUIDString | null;
  metadata?: unknown | null;
}

export interface MarkNotificationReadData {
  inAppNotification_update?: InAppNotification_Key | null;
}

export interface MarkNotificationReadVariables {
  id: UUIDString;
}

export interface MarketingTrigger_Key {
  id: UUIDString;
  __typename?: 'MarketingTrigger_Key';
}

export interface NotificationLog_Key {
  id: UUIDString;
  __typename?: 'NotificationLog_Key';
}

export interface NotificationSetting_Key {
  id: UUIDString;
  __typename?: 'NotificationSetting_Key';
}

export interface OrgSetting_Key {
  orgId: UUIDString;
  __typename?: 'OrgSetting_Key';
}

export interface Org_Key {
  id: UUIDString;
  __typename?: 'Org_Key';
}

export interface PackageTemplate_Key {
  id: UUIDString;
  __typename?: 'PackageTemplate_Key';
}

export interface PosTransaction_Key {
  id: UUIDString;
  __typename?: 'PosTransaction_Key';
}

export interface Product_Key {
  id: UUIDString;
  __typename?: 'Product_Key';
}

export interface Profile_Key {
  id: UUIDString;
  __typename?: 'Profile_Key';
}

export interface ProvisionOrgSettingData {
  orgSetting_upsert: OrgSetting_Key;
}

export interface ProvisionOrgSettingVariables {
  orgId: UUIDString;
  stripeCustomerId: string;
  stripeSubscriptionId: string;
}

export interface ProvisionProfileData {
  profile_insert: Profile_Key;
}

export interface ProvisionProfileVariables {
  userId: string;
  orgId: UUIDString;
  fullName: string;
  email: string;
  role: string;
}

export interface QueueEntry_Key {
  id: UUIDString;
  __typename?: 'QueueEntry_Key';
}

export interface SearchClientsData {
  clients: ({
    id: UUIDString;
    name: string;
    email?: string | null;
  } & Client_Key)[];
}

export interface SearchClientsVariables {
  orgId: UUIDString;
  query: string;
}

export interface SeatAssignment_Key {
  id: UUIDString;
  __typename?: 'SeatAssignment_Key';
}

export interface Service_Key {
  id: UUIDString;
  __typename?: 'Service_Key';
}

export interface Slot_Key {
  id: UUIDString;
  __typename?: 'Slot_Key';
}

export interface StaffShift_Key {
  id: UUIDString;
  __typename?: 'StaffShift_Key';
}

export interface UpdateAppointmentStatusData {
  appointment_update?: Appointment_Key | null;
}

export interface UpdateAppointmentStatusVariables {
  id: UUIDString;
  status: string;
}

export interface UpdateBookingData {
  booking_update?: Booking_Key | null;
}

export interface UpdateBookingVariables {
  id: UUIDString;
  status?: string | null;
  paymentStatus?: string | null;
  reminder24hSent?: boolean | null;
  reminder2hSent?: boolean | null;
  googleEventId?: string | null;
  googleEventLink?: string | null;
}

export interface UpdateClientData {
  client_update?: Client_Key | null;
}

export interface UpdateClientVariables {
  id: UUIDString;
  name: string;
  email?: string | null;
  phone?: string | null;
  dateOfBirth?: DateString | null;
  address?: string | null;
  notes?: string | null;
}

export interface UpdateOrgBrandingData {
  org_update?: Org_Key | null;
}

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

export interface UpdateOrgGoogleCalendarData {
  orgSetting_upsert: OrgSetting_Key;
}

export interface UpdateOrgGoogleCalendarVariables {
  orgId: UUIDString;
  externalCalendarSyncEnabled?: boolean | null;
  googleRefreshToken?: string | null;
  googleAccessToken?: string | null;
  googleTokenExpiry?: number | null;
  externalCalendarId?: string | null;
  externalCalendarType?: string | null;
}

export interface UpdateOrgSettingsData {
  orgSetting_upsert: OrgSetting_Key;
}

export interface UpdateOrgSettingsVariables {
  orgId: UUIDString;
  disabledWidgets?: unknown | null;
  bookingConfig?: unknown | null;
  allowPhotoUpload?: boolean | null;
  paymentRequired?: boolean | null;
}

export interface UpdateProfileStatusData {
  profile_update?: Profile_Key | null;
}

export interface UpdateProfileStatusVariables {
  id: UUIDString;
  isActive: boolean;
}

export interface UpdateQueueStatusData {
  queueEntry_update?: QueueEntry_Key | null;
}

export interface UpdateQueueStatusVariables {
  id: UUIDString;
  status?: string | null;
  position?: number | null;
  calledAt?: TimestampString | null;
  completedAt?: TimestampString | null;
}

export interface WidgetConfig_Key {
  id: UUIDString;
  __typename?: 'WidgetConfig_Key';
}

interface GetUserProfileRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetUserProfileData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetUserProfileData, undefined>;
  operationName: string;
}
export const getUserProfileRef: GetUserProfileRef;

export function getUserProfile(options?: ExecuteQueryOptions): QueryPromise<GetUserProfileData, undefined>;
export function getUserProfile(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<GetUserProfileData, undefined>;

interface GetOrgSettingsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetOrgSettingsVariables): QueryRef<GetOrgSettingsData, GetOrgSettingsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetOrgSettingsVariables): QueryRef<GetOrgSettingsData, GetOrgSettingsVariables>;
  operationName: string;
}
export const getOrgSettingsRef: GetOrgSettingsRef;

export function getOrgSettings(vars: GetOrgSettingsVariables, options?: ExecuteQueryOptions): QueryPromise<GetOrgSettingsData, GetOrgSettingsVariables>;
export function getOrgSettings(dc: DataConnect, vars: GetOrgSettingsVariables, options?: ExecuteQueryOptions): QueryPromise<GetOrgSettingsData, GetOrgSettingsVariables>;

interface GetOrgProfilesRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetOrgProfilesVariables): QueryRef<GetOrgProfilesData, GetOrgProfilesVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetOrgProfilesVariables): QueryRef<GetOrgProfilesData, GetOrgProfilesVariables>;
  operationName: string;
}
export const getOrgProfilesRef: GetOrgProfilesRef;

export function getOrgProfiles(vars: GetOrgProfilesVariables, options?: ExecuteQueryOptions): QueryPromise<GetOrgProfilesData, GetOrgProfilesVariables>;
export function getOrgProfiles(dc: DataConnect, vars: GetOrgProfilesVariables, options?: ExecuteQueryOptions): QueryPromise<GetOrgProfilesData, GetOrgProfilesVariables>;

interface UpdateProfileStatusRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateProfileStatusVariables): MutationRef<UpdateProfileStatusData, UpdateProfileStatusVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateProfileStatusVariables): MutationRef<UpdateProfileStatusData, UpdateProfileStatusVariables>;
  operationName: string;
}
export const updateProfileStatusRef: UpdateProfileStatusRef;

export function updateProfileStatus(vars: UpdateProfileStatusVariables): MutationPromise<UpdateProfileStatusData, UpdateProfileStatusVariables>;
export function updateProfileStatus(dc: DataConnect, vars: UpdateProfileStatusVariables): MutationPromise<UpdateProfileStatusData, UpdateProfileStatusVariables>;

interface CreateOrgProfileRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateOrgProfileVariables): MutationRef<CreateOrgProfileData, CreateOrgProfileVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateOrgProfileVariables): MutationRef<CreateOrgProfileData, CreateOrgProfileVariables>;
  operationName: string;
}
export const createOrgProfileRef: CreateOrgProfileRef;

export function createOrgProfile(vars: CreateOrgProfileVariables): MutationPromise<CreateOrgProfileData, CreateOrgProfileVariables>;
export function createOrgProfile(dc: DataConnect, vars: CreateOrgProfileVariables): MutationPromise<CreateOrgProfileData, CreateOrgProfileVariables>;

interface UpdateOrgBrandingRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateOrgBrandingVariables): MutationRef<UpdateOrgBrandingData, UpdateOrgBrandingVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateOrgBrandingVariables): MutationRef<UpdateOrgBrandingData, UpdateOrgBrandingVariables>;
  operationName: string;
}
export const updateOrgBrandingRef: UpdateOrgBrandingRef;

export function updateOrgBranding(vars: UpdateOrgBrandingVariables): MutationPromise<UpdateOrgBrandingData, UpdateOrgBrandingVariables>;
export function updateOrgBranding(dc: DataConnect, vars: UpdateOrgBrandingVariables): MutationPromise<UpdateOrgBrandingData, UpdateOrgBrandingVariables>;

interface UpdateOrgSettingsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateOrgSettingsVariables): MutationRef<UpdateOrgSettingsData, UpdateOrgSettingsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateOrgSettingsVariables): MutationRef<UpdateOrgSettingsData, UpdateOrgSettingsVariables>;
  operationName: string;
}
export const updateOrgSettingsRef: UpdateOrgSettingsRef;

export function updateOrgSettings(vars: UpdateOrgSettingsVariables): MutationPromise<UpdateOrgSettingsData, UpdateOrgSettingsVariables>;
export function updateOrgSettings(dc: DataConnect, vars: UpdateOrgSettingsVariables): MutationPromise<UpdateOrgSettingsData, UpdateOrgSettingsVariables>;

interface CreateOrgRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateOrgVariables): MutationRef<CreateOrgData, CreateOrgVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateOrgVariables): MutationRef<CreateOrgData, CreateOrgVariables>;
  operationName: string;
}
export const createOrgRef: CreateOrgRef;

export function createOrg(vars: CreateOrgVariables): MutationPromise<CreateOrgData, CreateOrgVariables>;
export function createOrg(dc: DataConnect, vars: CreateOrgVariables): MutationPromise<CreateOrgData, CreateOrgVariables>;

interface ProvisionProfileRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ProvisionProfileVariables): MutationRef<ProvisionProfileData, ProvisionProfileVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ProvisionProfileVariables): MutationRef<ProvisionProfileData, ProvisionProfileVariables>;
  operationName: string;
}
export const provisionProfileRef: ProvisionProfileRef;

export function provisionProfile(vars: ProvisionProfileVariables): MutationPromise<ProvisionProfileData, ProvisionProfileVariables>;
export function provisionProfile(dc: DataConnect, vars: ProvisionProfileVariables): MutationPromise<ProvisionProfileData, ProvisionProfileVariables>;

interface ProvisionOrgSettingRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ProvisionOrgSettingVariables): MutationRef<ProvisionOrgSettingData, ProvisionOrgSettingVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ProvisionOrgSettingVariables): MutationRef<ProvisionOrgSettingData, ProvisionOrgSettingVariables>;
  operationName: string;
}
export const provisionOrgSettingRef: ProvisionOrgSettingRef;

export function provisionOrgSetting(vars: ProvisionOrgSettingVariables): MutationPromise<ProvisionOrgSettingData, ProvisionOrgSettingVariables>;
export function provisionOrgSetting(dc: DataConnect, vars: ProvisionOrgSettingVariables): MutationPromise<ProvisionOrgSettingData, ProvisionOrgSettingVariables>;

interface GetAdminDashboardStatsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetAdminDashboardStatsVariables): QueryRef<GetAdminDashboardStatsData, GetAdminDashboardStatsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetAdminDashboardStatsVariables): QueryRef<GetAdminDashboardStatsData, GetAdminDashboardStatsVariables>;
  operationName: string;
}
export const getAdminDashboardStatsRef: GetAdminDashboardStatsRef;

export function getAdminDashboardStats(vars: GetAdminDashboardStatsVariables, options?: ExecuteQueryOptions): QueryPromise<GetAdminDashboardStatsData, GetAdminDashboardStatsVariables>;
export function getAdminDashboardStats(dc: DataConnect, vars: GetAdminDashboardStatsVariables, options?: ExecuteQueryOptions): QueryPromise<GetAdminDashboardStatsData, GetAdminDashboardStatsVariables>;

interface GetBookingPageDataRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetBookingPageDataVariables): QueryRef<GetBookingPageDataData, GetBookingPageDataVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetBookingPageDataVariables): QueryRef<GetBookingPageDataData, GetBookingPageDataVariables>;
  operationName: string;
}
export const getBookingPageDataRef: GetBookingPageDataRef;

export function getBookingPageData(vars: GetBookingPageDataVariables, options?: ExecuteQueryOptions): QueryPromise<GetBookingPageDataData, GetBookingPageDataVariables>;
export function getBookingPageData(dc: DataConnect, vars: GetBookingPageDataVariables, options?: ExecuteQueryOptions): QueryPromise<GetBookingPageDataData, GetBookingPageDataVariables>;

interface GetAppointmentsForDayRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetAppointmentsForDayVariables): QueryRef<GetAppointmentsForDayData, GetAppointmentsForDayVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetAppointmentsForDayVariables): QueryRef<GetAppointmentsForDayData, GetAppointmentsForDayVariables>;
  operationName: string;
}
export const getAppointmentsForDayRef: GetAppointmentsForDayRef;

export function getAppointmentsForDay(vars: GetAppointmentsForDayVariables, options?: ExecuteQueryOptions): QueryPromise<GetAppointmentsForDayData, GetAppointmentsForDayVariables>;
export function getAppointmentsForDay(dc: DataConnect, vars: GetAppointmentsForDayVariables, options?: ExecuteQueryOptions): QueryPromise<GetAppointmentsForDayData, GetAppointmentsForDayVariables>;

interface GetBookingByIdRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetBookingByIdVariables): QueryRef<GetBookingByIdData, GetBookingByIdVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetBookingByIdVariables): QueryRef<GetBookingByIdData, GetBookingByIdVariables>;
  operationName: string;
}
export const getBookingByIdRef: GetBookingByIdRef;

export function getBookingById(vars: GetBookingByIdVariables, options?: ExecuteQueryOptions): QueryPromise<GetBookingByIdData, GetBookingByIdVariables>;
export function getBookingById(dc: DataConnect, vars: GetBookingByIdVariables, options?: ExecuteQueryOptions): QueryPromise<GetBookingByIdData, GetBookingByIdVariables>;

interface CreateBookingRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateBookingVariables): MutationRef<CreateBookingData, CreateBookingVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateBookingVariables): MutationRef<CreateBookingData, CreateBookingVariables>;
  operationName: string;
}
export const createBookingRef: CreateBookingRef;

export function createBooking(vars: CreateBookingVariables): MutationPromise<CreateBookingData, CreateBookingVariables>;
export function createBooking(dc: DataConnect, vars: CreateBookingVariables): MutationPromise<CreateBookingData, CreateBookingVariables>;

interface UpdateBookingRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateBookingVariables): MutationRef<UpdateBookingData, UpdateBookingVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateBookingVariables): MutationRef<UpdateBookingData, UpdateBookingVariables>;
  operationName: string;
}
export const updateBookingRef: UpdateBookingRef;

export function updateBooking(vars: UpdateBookingVariables): MutationPromise<UpdateBookingData, UpdateBookingVariables>;
export function updateBooking(dc: DataConnect, vars: UpdateBookingVariables): MutationPromise<UpdateBookingData, UpdateBookingVariables>;

interface GetUpcomingBookingsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetUpcomingBookingsVariables): QueryRef<GetUpcomingBookingsData, GetUpcomingBookingsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetUpcomingBookingsVariables): QueryRef<GetUpcomingBookingsData, GetUpcomingBookingsVariables>;
  operationName: string;
}
export const getUpcomingBookingsRef: GetUpcomingBookingsRef;

export function getUpcomingBookings(vars: GetUpcomingBookingsVariables, options?: ExecuteQueryOptions): QueryPromise<GetUpcomingBookingsData, GetUpcomingBookingsVariables>;
export function getUpcomingBookings(dc: DataConnect, vars: GetUpcomingBookingsVariables, options?: ExecuteQueryOptions): QueryPromise<GetUpcomingBookingsData, GetUpcomingBookingsVariables>;

interface UpdateOrgGoogleCalendarRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateOrgGoogleCalendarVariables): MutationRef<UpdateOrgGoogleCalendarData, UpdateOrgGoogleCalendarVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateOrgGoogleCalendarVariables): MutationRef<UpdateOrgGoogleCalendarData, UpdateOrgGoogleCalendarVariables>;
  operationName: string;
}
export const updateOrgGoogleCalendarRef: UpdateOrgGoogleCalendarRef;

export function updateOrgGoogleCalendar(vars: UpdateOrgGoogleCalendarVariables): MutationPromise<UpdateOrgGoogleCalendarData, UpdateOrgGoogleCalendarVariables>;
export function updateOrgGoogleCalendar(dc: DataConnect, vars: UpdateOrgGoogleCalendarVariables): MutationPromise<UpdateOrgGoogleCalendarData, UpdateOrgGoogleCalendarVariables>;

interface GetClientByEmailRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetClientByEmailVariables): QueryRef<GetClientByEmailData, GetClientByEmailVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetClientByEmailVariables): QueryRef<GetClientByEmailData, GetClientByEmailVariables>;
  operationName: string;
}
export const getClientByEmailRef: GetClientByEmailRef;

export function getClientByEmail(vars: GetClientByEmailVariables, options?: ExecuteQueryOptions): QueryPromise<GetClientByEmailData, GetClientByEmailVariables>;
export function getClientByEmail(dc: DataConnect, vars: GetClientByEmailVariables, options?: ExecuteQueryOptions): QueryPromise<GetClientByEmailData, GetClientByEmailVariables>;

interface GetClientByPhoneRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetClientByPhoneVariables): QueryRef<GetClientByPhoneData, GetClientByPhoneVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetClientByPhoneVariables): QueryRef<GetClientByPhoneData, GetClientByPhoneVariables>;
  operationName: string;
}
export const getClientByPhoneRef: GetClientByPhoneRef;

export function getClientByPhone(vars: GetClientByPhoneVariables, options?: ExecuteQueryOptions): QueryPromise<GetClientByPhoneData, GetClientByPhoneVariables>;
export function getClientByPhone(dc: DataConnect, vars: GetClientByPhoneVariables, options?: ExecuteQueryOptions): QueryPromise<GetClientByPhoneData, GetClientByPhoneVariables>;

interface GetClientAppointmentsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetClientAppointmentsVariables): QueryRef<GetClientAppointmentsData, GetClientAppointmentsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetClientAppointmentsVariables): QueryRef<GetClientAppointmentsData, GetClientAppointmentsVariables>;
  operationName: string;
}
export const getClientAppointmentsRef: GetClientAppointmentsRef;

export function getClientAppointments(vars: GetClientAppointmentsVariables, options?: ExecuteQueryOptions): QueryPromise<GetClientAppointmentsData, GetClientAppointmentsVariables>;
export function getClientAppointments(dc: DataConnect, vars: GetClientAppointmentsVariables, options?: ExecuteQueryOptions): QueryPromise<GetClientAppointmentsData, GetClientAppointmentsVariables>;

interface UpdateAppointmentStatusRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateAppointmentStatusVariables): MutationRef<UpdateAppointmentStatusData, UpdateAppointmentStatusVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateAppointmentStatusVariables): MutationRef<UpdateAppointmentStatusData, UpdateAppointmentStatusVariables>;
  operationName: string;
}
export const updateAppointmentStatusRef: UpdateAppointmentStatusRef;

export function updateAppointmentStatus(vars: UpdateAppointmentStatusVariables): MutationPromise<UpdateAppointmentStatusData, UpdateAppointmentStatusVariables>;
export function updateAppointmentStatus(dc: DataConnect, vars: UpdateAppointmentStatusVariables): MutationPromise<UpdateAppointmentStatusData, UpdateAppointmentStatusVariables>;

interface GetOrgAppointmentsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetOrgAppointmentsVariables): QueryRef<GetOrgAppointmentsData, GetOrgAppointmentsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetOrgAppointmentsVariables): QueryRef<GetOrgAppointmentsData, GetOrgAppointmentsVariables>;
  operationName: string;
}
export const getOrgAppointmentsRef: GetOrgAppointmentsRef;

export function getOrgAppointments(vars: GetOrgAppointmentsVariables, options?: ExecuteQueryOptions): QueryPromise<GetOrgAppointmentsData, GetOrgAppointmentsVariables>;
export function getOrgAppointments(dc: DataConnect, vars: GetOrgAppointmentsVariables, options?: ExecuteQueryOptions): QueryPromise<GetOrgAppointmentsData, GetOrgAppointmentsVariables>;

interface CreateAppointmentRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateAppointmentVariables): MutationRef<CreateAppointmentData, CreateAppointmentVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateAppointmentVariables): MutationRef<CreateAppointmentData, CreateAppointmentVariables>;
  operationName: string;
}
export const createAppointmentRef: CreateAppointmentRef;

export function createAppointment(vars: CreateAppointmentVariables): MutationPromise<CreateAppointmentData, CreateAppointmentVariables>;
export function createAppointment(dc: DataConnect, vars: CreateAppointmentVariables): MutationPromise<CreateAppointmentData, CreateAppointmentVariables>;

interface GetActiveServicesRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetActiveServicesVariables): QueryRef<GetActiveServicesData, GetActiveServicesVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetActiveServicesVariables): QueryRef<GetActiveServicesData, GetActiveServicesVariables>;
  operationName: string;
}
export const getActiveServicesRef: GetActiveServicesRef;

export function getActiveServices(vars: GetActiveServicesVariables, options?: ExecuteQueryOptions): QueryPromise<GetActiveServicesData, GetActiveServicesVariables>;
export function getActiveServices(dc: DataConnect, vars: GetActiveServicesVariables, options?: ExecuteQueryOptions): QueryPromise<GetActiveServicesData, GetActiveServicesVariables>;

interface SearchClientsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: SearchClientsVariables): QueryRef<SearchClientsData, SearchClientsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: SearchClientsVariables): QueryRef<SearchClientsData, SearchClientsVariables>;
  operationName: string;
}
export const searchClientsRef: SearchClientsRef;

export function searchClients(vars: SearchClientsVariables, options?: ExecuteQueryOptions): QueryPromise<SearchClientsData, SearchClientsVariables>;
export function searchClients(dc: DataConnect, vars: SearchClientsVariables, options?: ExecuteQueryOptions): QueryPromise<SearchClientsData, SearchClientsVariables>;

interface CreateServiceRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateServiceVariables): MutationRef<CreateServiceData, CreateServiceVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateServiceVariables): MutationRef<CreateServiceData, CreateServiceVariables>;
  operationName: string;
}
export const createServiceRef: CreateServiceRef;

export function createService(vars: CreateServiceVariables): MutationPromise<CreateServiceData, CreateServiceVariables>;
export function createService(dc: DataConnect, vars: CreateServiceVariables): MutationPromise<CreateServiceData, CreateServiceVariables>;

interface GetOrgClientsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetOrgClientsVariables): QueryRef<GetOrgClientsData, GetOrgClientsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetOrgClientsVariables): QueryRef<GetOrgClientsData, GetOrgClientsVariables>;
  operationName: string;
}
export const getOrgClientsRef: GetOrgClientsRef;

export function getOrgClients(vars: GetOrgClientsVariables, options?: ExecuteQueryOptions): QueryPromise<GetOrgClientsData, GetOrgClientsVariables>;
export function getOrgClients(dc: DataConnect, vars: GetOrgClientsVariables, options?: ExecuteQueryOptions): QueryPromise<GetOrgClientsData, GetOrgClientsVariables>;

interface GetClientDetailRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetClientDetailVariables): QueryRef<GetClientDetailData, GetClientDetailVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetClientDetailVariables): QueryRef<GetClientDetailData, GetClientDetailVariables>;
  operationName: string;
}
export const getClientDetailRef: GetClientDetailRef;

export function getClientDetail(vars: GetClientDetailVariables, options?: ExecuteQueryOptions): QueryPromise<GetClientDetailData, GetClientDetailVariables>;
export function getClientDetail(dc: DataConnect, vars: GetClientDetailVariables, options?: ExecuteQueryOptions): QueryPromise<GetClientDetailData, GetClientDetailVariables>;

interface CreateClientRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateClientVariables): MutationRef<CreateClientData, CreateClientVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateClientVariables): MutationRef<CreateClientData, CreateClientVariables>;
  operationName: string;
}
export const createClientRef: CreateClientRef;

export function createClient(vars: CreateClientVariables): MutationPromise<CreateClientData, CreateClientVariables>;
export function createClient(dc: DataConnect, vars: CreateClientVariables): MutationPromise<CreateClientData, CreateClientVariables>;

interface UpdateClientRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateClientVariables): MutationRef<UpdateClientData, UpdateClientVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateClientVariables): MutationRef<UpdateClientData, UpdateClientVariables>;
  operationName: string;
}
export const updateClientRef: UpdateClientRef;

export function updateClient(vars: UpdateClientVariables): MutationPromise<UpdateClientData, UpdateClientVariables>;
export function updateClient(dc: DataConnect, vars: UpdateClientVariables): MutationPromise<UpdateClientData, UpdateClientVariables>;

interface GetOrgQueueRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetOrgQueueVariables): QueryRef<GetOrgQueueData, GetOrgQueueVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetOrgQueueVariables): QueryRef<GetOrgQueueData, GetOrgQueueVariables>;
  operationName: string;
}
export const getOrgQueueRef: GetOrgQueueRef;

export function getOrgQueue(vars: GetOrgQueueVariables, options?: ExecuteQueryOptions): QueryPromise<GetOrgQueueData, GetOrgQueueVariables>;
export function getOrgQueue(dc: DataConnect, vars: GetOrgQueueVariables, options?: ExecuteQueryOptions): QueryPromise<GetOrgQueueData, GetOrgQueueVariables>;

interface CreateQueueEntryRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateQueueEntryVariables): MutationRef<CreateQueueEntryData, CreateQueueEntryVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateQueueEntryVariables): MutationRef<CreateQueueEntryData, CreateQueueEntryVariables>;
  operationName: string;
}
export const createQueueEntryRef: CreateQueueEntryRef;

export function createQueueEntry(vars: CreateQueueEntryVariables): MutationPromise<CreateQueueEntryData, CreateQueueEntryVariables>;
export function createQueueEntry(dc: DataConnect, vars: CreateQueueEntryVariables): MutationPromise<CreateQueueEntryData, CreateQueueEntryVariables>;

interface UpdateQueueStatusRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateQueueStatusVariables): MutationRef<UpdateQueueStatusData, UpdateQueueStatusVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateQueueStatusVariables): MutationRef<UpdateQueueStatusData, UpdateQueueStatusVariables>;
  operationName: string;
}
export const updateQueueStatusRef: UpdateQueueStatusRef;

export function updateQueueStatus(vars: UpdateQueueStatusVariables): MutationPromise<UpdateQueueStatusData, UpdateQueueStatusVariables>;
export function updateQueueStatus(dc: DataConnect, vars: UpdateQueueStatusVariables): MutationPromise<UpdateQueueStatusData, UpdateQueueStatusVariables>;

interface DeleteQueueEntryRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteQueueEntryVariables): MutationRef<DeleteQueueEntryData, DeleteQueueEntryVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteQueueEntryVariables): MutationRef<DeleteQueueEntryData, DeleteQueueEntryVariables>;
  operationName: string;
}
export const deleteQueueEntryRef: DeleteQueueEntryRef;

export function deleteQueueEntry(vars: DeleteQueueEntryVariables): MutationPromise<DeleteQueueEntryData, DeleteQueueEntryVariables>;
export function deleteQueueEntry(dc: DataConnect, vars: DeleteQueueEntryVariables): MutationPromise<DeleteQueueEntryData, DeleteQueueEntryVariables>;

interface GetUpcomingOrgAppointmentsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetUpcomingOrgAppointmentsVariables): QueryRef<GetUpcomingOrgAppointmentsData, GetUpcomingOrgAppointmentsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetUpcomingOrgAppointmentsVariables): QueryRef<GetUpcomingOrgAppointmentsData, GetUpcomingOrgAppointmentsVariables>;
  operationName: string;
}
export const getUpcomingOrgAppointmentsRef: GetUpcomingOrgAppointmentsRef;

export function getUpcomingOrgAppointments(vars: GetUpcomingOrgAppointmentsVariables, options?: ExecuteQueryOptions): QueryPromise<GetUpcomingOrgAppointmentsData, GetUpcomingOrgAppointmentsVariables>;
export function getUpcomingOrgAppointments(dc: DataConnect, vars: GetUpcomingOrgAppointmentsVariables, options?: ExecuteQueryOptions): QueryPromise<GetUpcomingOrgAppointmentsData, GetUpcomingOrgAppointmentsVariables>;

interface GetSlotsForDayRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetSlotsForDayVariables): QueryRef<GetSlotsForDayData, GetSlotsForDayVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetSlotsForDayVariables): QueryRef<GetSlotsForDayData, GetSlotsForDayVariables>;
  operationName: string;
}
export const getSlotsForDayRef: GetSlotsForDayRef;

export function getSlotsForDay(vars: GetSlotsForDayVariables, options?: ExecuteQueryOptions): QueryPromise<GetSlotsForDayData, GetSlotsForDayVariables>;
export function getSlotsForDay(dc: DataConnect, vars: GetSlotsForDayVariables, options?: ExecuteQueryOptions): QueryPromise<GetSlotsForDayData, GetSlotsForDayVariables>;

interface GetActivePackageTemplatesRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetActivePackageTemplatesVariables): QueryRef<GetActivePackageTemplatesData, GetActivePackageTemplatesVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetActivePackageTemplatesVariables): QueryRef<GetActivePackageTemplatesData, GetActivePackageTemplatesVariables>;
  operationName: string;
}
export const getActivePackageTemplatesRef: GetActivePackageTemplatesRef;

export function getActivePackageTemplates(vars: GetActivePackageTemplatesVariables, options?: ExecuteQueryOptions): QueryPromise<GetActivePackageTemplatesData, GetActivePackageTemplatesVariables>;
export function getActivePackageTemplates(dc: DataConnect, vars: GetActivePackageTemplatesVariables, options?: ExecuteQueryOptions): QueryPromise<GetActivePackageTemplatesData, GetActivePackageTemplatesVariables>;

interface CreateClientPackageRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateClientPackageVariables): MutationRef<CreateClientPackageData, CreateClientPackageVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateClientPackageVariables): MutationRef<CreateClientPackageData, CreateClientPackageVariables>;
  operationName: string;
}
export const createClientPackageRef: CreateClientPackageRef;

export function createClientPackage(vars: CreateClientPackageVariables): MutationPromise<CreateClientPackageData, CreateClientPackageVariables>;
export function createClientPackage(dc: DataConnect, vars: CreateClientPackageVariables): MutationPromise<CreateClientPackageData, CreateClientPackageVariables>;

interface LogActivityRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: LogActivityVariables): MutationRef<LogActivityData, LogActivityVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: LogActivityVariables): MutationRef<LogActivityData, LogActivityVariables>;
  operationName: string;
}
export const logActivityRef: LogActivityRef;

export function logActivity(vars: LogActivityVariables): MutationPromise<LogActivityData, LogActivityVariables>;
export function logActivity(dc: DataConnect, vars: LogActivityVariables): MutationPromise<LogActivityData, LogActivityVariables>;

interface GetInAppNotificationsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetInAppNotificationsVariables): QueryRef<GetInAppNotificationsData, GetInAppNotificationsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetInAppNotificationsVariables): QueryRef<GetInAppNotificationsData, GetInAppNotificationsVariables>;
  operationName: string;
}
export const getInAppNotificationsRef: GetInAppNotificationsRef;

export function getInAppNotifications(vars: GetInAppNotificationsVariables, options?: ExecuteQueryOptions): QueryPromise<GetInAppNotificationsData, GetInAppNotificationsVariables>;
export function getInAppNotifications(dc: DataConnect, vars: GetInAppNotificationsVariables, options?: ExecuteQueryOptions): QueryPromise<GetInAppNotificationsData, GetInAppNotificationsVariables>;

interface MarkNotificationReadRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: MarkNotificationReadVariables): MutationRef<MarkNotificationReadData, MarkNotificationReadVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: MarkNotificationReadVariables): MutationRef<MarkNotificationReadData, MarkNotificationReadVariables>;
  operationName: string;
}
export const markNotificationReadRef: MarkNotificationReadRef;

export function markNotificationRead(vars: MarkNotificationReadVariables): MutationPromise<MarkNotificationReadData, MarkNotificationReadVariables>;
export function markNotificationRead(dc: DataConnect, vars: MarkNotificationReadVariables): MutationPromise<MarkNotificationReadData, MarkNotificationReadVariables>;

