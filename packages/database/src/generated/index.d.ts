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

export interface AssignSeatData {
  seatAssignment_insert: SeatAssignment_Key;
}

export interface AssignSeatVariables {
  orgId: UUIDString;
  zoneId: UUIDString;
  zoneName: string;
  queueEntryId: UUIDString;
  clientName: string;
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

export interface ClearSeatData {
  seatAssignment_update?: SeatAssignment_Key | null;
}

export interface ClearSeatVariables {
  id: UUIDString;
  clearedAt: TimestampString;
}

export interface ClientPackage_Key {
  id: UUIDString;
  __typename?: 'ClientPackage_Key';
}

export interface Client_Key {
  id: UUIDString;
  __typename?: 'Client_Key';
}

export interface CreateAnnouncementData {
  announcement_insert: Announcement_Key;
}

export interface CreateAnnouncementVariables {
  orgId: UUIDString;
  message: string;
  postedById: UUIDString;
}

export interface CreateAppointmentData {
  appointment_insert: Appointment_Key;
}

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

export interface CreateBookingData {
  booking_insert: Booking_Key;
}

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

export interface CreateClassData {
  class_insert: Class_Key;
}

export interface CreateClassRegistrationData {
  classRegistration_insert: ClassRegistration_Key;
}

export interface CreateClassRegistrationVariables {
  orgId: UUIDString;
  classId: UUIDString;
  clientId: UUIDString;
  classDate: DateString;
  status: string;
}

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

export interface CreateIntakeSubmissionData {
  intakeFormSubmission_insert: IntakeFormSubmission_Key;
}

export interface CreateIntakeSubmissionVariables {
  orgId: UUIDString;
  formId: UUIDString;
  clientId: UUIDString;
  appointmentId?: UUIDString | null;
  responses: unknown;
}

export interface CreateIntakeTemplateData {
  intakeFormTemplate_insert: IntakeFormTemplate_Key;
}

export interface CreateIntakeTemplateVariables {
  orgId: UUIDString;
  name: string;
  fields: unknown;
  isActive: boolean;
}

export interface CreateMarketingTriggerData {
  marketingTrigger_insert: MarketingTrigger_Key;
}

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

export interface CreatePackageTemplateData {
  packageTemplate_insert: PackageTemplate_Key;
}

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

export interface CreatePosTransactionData {
  posTransaction_insert: PosTransaction_Key;
}

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

export interface CreateProductData {
  product_insert: Product_Key;
}

export interface CreateProductVariables {
  orgId: UUIDString;
  name: string;
  priceCents: number;
  stockCount?: number | null;
  lowStockThreshold?: number | null;
  isActive: boolean;
}

export interface CreateQueueEntryData {
  queueEntry_insert: QueueEntry_Key;
}

export interface CreateQueueEntryVariables {
  orgId: UUIDString;
  clientName: string;
  clientId?: UUIDString | null;
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

export interface CreateSlotData {
  slot_insert: Slot_Key;
}

export interface CreateSlotVariables {
  orgId: UUIDString;
  startTime: TimestampString;
  endTime: TimestampString;
  status: string;
  staffId?: UUIDString | null;
}

export interface CreateStaffShiftData {
  staffShift_insert: StaffShift_Key;
}

export interface CreateStaffShiftVariables {
  orgId: UUIDString;
  staffId: UUIDString;
  shiftDate: DateString;
  startTime: string;
  endTime: string;
  notes?: string | null;
}

export interface DeleteAnnouncementData {
  announcement_delete?: Announcement_Key | null;
}

export interface DeleteAnnouncementVariables {
  id: UUIDString;
}

export interface DeleteIntakeTemplateData {
  intakeFormTemplate_delete?: IntakeFormTemplate_Key | null;
}

export interface DeleteIntakeTemplateVariables {
  id: UUIDString;
}

export interface DeleteQueueEntryData {
  queueEntry_delete?: QueueEntry_Key | null;
}

export interface DeleteQueueEntryVariables {
  id: UUIDString;
}

export interface DeleteSlotData {
  slot_delete?: Slot_Key | null;
}

export interface DeleteSlotVariables {
  id: UUIDString;
}

export interface DeleteStaffShiftData {
  staffShift_delete?: StaffShift_Key | null;
}

export interface DeleteStaffShiftVariables {
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

export interface GetActiveClassesForBookingVariables {
  orgId: UUIDString;
}

export interface GetActiveIntakeTemplatesData {
  intakeFormTemplates: ({
    id: UUIDString;
    name: string;
    fields: unknown;
  } & IntakeFormTemplate_Key)[];
}

export interface GetActiveIntakeTemplatesVariables {
  orgId: UUIDString;
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
    description?: string | null;
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

export interface GetAnnouncementsVariables {
  orgId: UUIDString;
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

export interface GetAppointmentsForReportsVariables {
  orgId: UUIDString;
  since: TimestampString;
}

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

export interface GetAvailableSlotsForBookingVariables {
  orgId: UUIDString;
  now: TimestampString;
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

export interface GetClassRegistrationsCountData {
  classRegistrations: ({
    id: UUIDString;
  } & ClassRegistration_Key)[];
}

export interface GetClassRegistrationsCountVariables {
  classId: UUIDString;
  classDate: DateString;
}

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

export interface GetClassRegistrationsForAttendanceVariables {
  orgId: UUIDString;
  classId: UUIDString;
  classDate: DateString;
}

export interface GetClassRegistrationsForReportsData {
  classRegistrations: ({
    createdAt: TimestampString;
    classEntity: {
      name: string;
      capacity?: number | null;
    };
  })[];
}

export interface GetClassRegistrationsForReportsVariables {
  orgId: UUIDString;
  since: TimestampString;
}

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

export interface GetClassesForReportsData {
  classes: ({
    id: UUIDString;
    name: string;
    capacity?: number | null;
  } & Class_Key)[];
}

export interface GetClassesForReportsVariables {
  orgId: UUIDString;
}

export interface GetClassesVariables {
  orgId: UUIDString;
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

export interface GetClientDocumentsData {
  documents: ({
    id: UUIDString;
    title: string;
    fileUrl: string;
    createdAt: TimestampString;
  } & Document_Key)[];
}

export interface GetClientDocumentsVariables {
  orgId: UUIDString;
  clientId: UUIDString;
}

export interface GetClientsForReportsData {
  clients: ({
    id: UUIDString;
    name: string;
    email?: string | null;
    phone?: string | null;
    createdAt: TimestampString;
  } & Client_Key)[];
}

export interface GetClientsForReportsVariables {
  orgId: UUIDString;
}

export interface GetClientsForRetentionData {
  clients: ({
    id: UUIDString;
    name: string;
    email?: string | null;
    phone?: string | null;
    dateOfBirth?: DateString | null;
  } & Client_Key)[];
}

export interface GetClientsForRetentionVariables {
  orgId: UUIDString;
}

export interface GetCompletedAppointmentsForRetentionData {
  appointments: ({
    id: UUIDString;
    scheduledAt: TimestampString;
    client?: {
      id: UUIDString;
    } & Client_Key;
  } & Appointment_Key)[];
}

export interface GetCompletedAppointmentsForRetentionVariables {
  orgId: UUIDString;
}

export interface GetExistingRegistrationData {
  classRegistrations: ({
    id: UUIDString;
    status: string;
  } & ClassRegistration_Key)[];
}

export interface GetExistingRegistrationVariables {
  classId: UUIDString;
  clientId: UUIDString;
  classDate: DateString;
}

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

export interface GetFloorLayoutVariables {
  orgId: UUIDString;
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

export interface GetIntakeSubmissionsVariables {
  orgId: UUIDString;
  clientId: UUIDString;
}

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

export interface GetMarketingTriggersVariables {
  orgId: UUIDString;
}

export interface GetNotificationSettingsData {
  notificationSettings: ({
    id?: UUIDString | null;
    smsEnabled?: boolean | null;
    emailEnabled?: boolean | null;
    reminder24h?: boolean | null;
    reminder2h?: boolean | null;
  })[];
}

export interface GetNotificationSettingsVariables {
  orgId: UUIDString;
}

export interface GetOrgActivityLogsData {
  activityLogs: ({
    id: UUIDString;
    userId?: string | null;
    action: string;
    metadata?: unknown | null;
    createdAt: TimestampString;
  } & ActivityLog_Key)[];
}

export interface GetOrgActivityLogsVariables {
  orgId: UUIDString;
  limit: number;
  offset: number;
}

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

export interface GetOrgAppointmentsVariables {
  orgId: UUIDString;
}

export interface GetOrgByIdData {
  org?: {
    id: UUIDString;
    stripePublishableKey?: string | null;
  } & Org_Key;
}

export interface GetOrgByIdVariables {
  id: UUIDString;
}

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

export interface GetOrgClientPackagesVariables {
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

export interface GetOrgIntakeTemplatesData {
  intakeFormTemplates: ({
    id: UUIDString;
    name: string;
    fields: unknown;
    isActive?: boolean | null;
    createdAt: TimestampString;
  } & IntakeFormTemplate_Key)[];
}

export interface GetOrgIntakeTemplatesVariables {
  orgId: UUIDString;
}

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

export interface GetOrgPackageTemplatesVariables {
  orgId: UUIDString;
}

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

export interface GetOrgPosTransactionsVariables {
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

export interface GetOrgServicesData {
  services: ({
    id: UUIDString;
    name: string;
    durationMinutes?: number | null;
    price?: number | null;
    isArchived?: boolean | null;
  } & Service_Key)[];
}

export interface GetOrgServicesVariables {
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

export interface GetOrgWaitlistVariables {
  orgId: UUIDString;
}

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

export interface GetPendingOrgBookingsVariables {
  orgId: UUIDString;
}

export interface GetPosProductsData {
  products: ({
    id: UUIDString;
    name: string;
    priceCents: number;
    stockCount?: number | null;
  } & Product_Key)[];
}

export interface GetPosProductsVariables {
  orgId: UUIDString;
}

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

export interface GetProductsForInventoryVariables {
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

export interface GetStaffShiftsVariables {
  orgId: UUIDString;
  start: DateString;
  end: DateString;
}

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

export interface GetTodayFloorAppointmentsVariables {
  orgId: UUIDString;
  todayStart: TimestampString;
  todayEnd: TimestampString;
}

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

export interface GetUnconfirmedAppointmentsVariables {
  orgId: UUIDString;
  now: TimestampString;
  in48h: TimestampString;
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

export interface GetUpcomingSlotsVariables {
  orgId: UUIDString;
  now: TimestampString;
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
      patientCheckinEnabled?: boolean | null;
    } & Org_Key;
  } & Profile_Key)[];
}

export interface GetWidgetConfigData {
  widgetConfigs: ({
    config: unknown;
  })[];
}

export interface GetWidgetConfigVariables {
  userId: string;
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
  orgId: UUIDString;
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
    phone?: string | null;
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

export interface TogglePackageTemplateActiveData {
  packageTemplate_update?: PackageTemplate_Key | null;
}

export interface TogglePackageTemplateActiveVariables {
  id: UUIDString;
  isActive: boolean;
}

export interface ToggleServiceArchiveData {
  service_update?: Service_Key | null;
}

export interface ToggleServiceArchiveVariables {
  id: UUIDString;
  isArchived: boolean;
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

export interface UpdateClassActiveStatusData {
  class_update?: Class_Key | null;
}

export interface UpdateClassActiveStatusVariables {
  id: UUIDString;
  isActive: boolean;
}

export interface UpdateClassData {
  class_update?: Class_Key | null;
}

export interface UpdateClassRegistrationStatusData {
  classRegistration_update?: ClassRegistration_Key | null;
}

export interface UpdateClassRegistrationStatusVariables {
  id: UUIDString;
  status: string;
}

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

export interface UpdateClientData {
  client_update?: Client_Key | null;
}

export interface UpdateClientPackageSessionsData {
  clientPackage_update?: ClientPackage_Key | null;
}

export interface UpdateClientPackageSessionsVariables {
  id: UUIDString;
  usedSessions: number;
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

export interface UpdateIntakeTemplateData {
  intakeFormTemplate_update?: IntakeFormTemplate_Key | null;
}

export interface UpdateIntakeTemplateVariables {
  id: UUIDString;
  name: string;
  fields: unknown;
  isActive: boolean;
}

export interface UpdateMarketingTriggerData {
  marketingTrigger_update?: MarketingTrigger_Key | null;
}

export interface UpdateMarketingTriggerVariables {
  id: UUIDString;
  channel: string;
  enabled: boolean;
  delayValue: number;
  delayUnit: string;
  message: string;
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

export interface UpdateOrgPatientCheckinData {
  org_update?: Org_Key | null;
}

export interface UpdateOrgPatientCheckinVariables {
  id: UUIDString;
  patientCheckinEnabled: boolean;
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

export interface UpdateOrgStripeCredentialsData {
  org_update?: Org_Key | null;
  orgSetting_upsert: OrgSetting_Key;
}

export interface UpdateOrgStripeCredentialsVariables {
  orgId: UUIDString;
  stripePublishableKey?: string | null;
  stripeSecretKey?: string | null;
  paymentRequired?: boolean | null;
}

export interface UpdatePackageTemplateData {
  packageTemplate_update?: PackageTemplate_Key | null;
}

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

export interface UpdateProductData {
  product_update?: Product_Key | null;
}

export interface UpdateProductStockData {
  product_update?: Product_Key | null;
}

export interface UpdateProductStockVariables {
  id: UUIDString;
  stockCount: number;
}

export interface UpdateProductVariables {
  id: UUIDString;
  name: string;
  priceCents: number;
  stockCount?: number | null;
  lowStockThreshold?: number | null;
  isActive: boolean;
}

export interface UpdateProfileCommissionRateData {
  profile_update?: Profile_Key | null;
}

export interface UpdateProfileCommissionRateVariables {
  id: UUIDString;
  commissionRatePercentage: number;
}

export interface UpdateProfileInfoData {
  profile_update?: Profile_Key | null;
}

export interface UpdateProfileInfoVariables {
  id: UUIDString;
  fullName: string;
  email: string;
  phone: string;
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

export interface UpdateServiceData {
  service_update?: Service_Key | null;
}

export interface UpdateServiceVariables {
  id: UUIDString;
  name: string;
  durationMinutes: number;
  price: number;
}

export interface UpdateSlotStatusData {
  slot_update?: Slot_Key | null;
}

export interface UpdateSlotStatusVariables {
  id: UUIDString;
  status: string;
}

export interface UpsertNotificationSettingsData {
  notificationSetting_upsert: NotificationSetting_Key;
}

export interface UpsertNotificationSettingsVariables {
  orgId: UUIDString;
  smsEnabled: boolean;
  emailEnabled: boolean;
  reminder24h: boolean;
  reminder2h: boolean;
}

export interface UpsertWidgetConfigData {
  widgetConfig_upsert: WidgetConfig_Key;
}

export interface UpsertWidgetConfigVariables {
  userId: string;
  orgId: UUIDString;
  config: unknown;
}

export interface WidgetConfig_Key {
  userId: string;
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

interface GetPosProductsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetPosProductsVariables): QueryRef<GetPosProductsData, GetPosProductsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetPosProductsVariables): QueryRef<GetPosProductsData, GetPosProductsVariables>;
  operationName: string;
}
export const getPosProductsRef: GetPosProductsRef;

export function getPosProducts(vars: GetPosProductsVariables, options?: ExecuteQueryOptions): QueryPromise<GetPosProductsData, GetPosProductsVariables>;
export function getPosProducts(dc: DataConnect, vars: GetPosProductsVariables, options?: ExecuteQueryOptions): QueryPromise<GetPosProductsData, GetPosProductsVariables>;

interface GetProductsForInventoryRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetProductsForInventoryVariables): QueryRef<GetProductsForInventoryData, GetProductsForInventoryVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetProductsForInventoryVariables): QueryRef<GetProductsForInventoryData, GetProductsForInventoryVariables>;
  operationName: string;
}
export const getProductsForInventoryRef: GetProductsForInventoryRef;

export function getProductsForInventory(vars: GetProductsForInventoryVariables, options?: ExecuteQueryOptions): QueryPromise<GetProductsForInventoryData, GetProductsForInventoryVariables>;
export function getProductsForInventory(dc: DataConnect, vars: GetProductsForInventoryVariables, options?: ExecuteQueryOptions): QueryPromise<GetProductsForInventoryData, GetProductsForInventoryVariables>;

interface CreateProductRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateProductVariables): MutationRef<CreateProductData, CreateProductVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateProductVariables): MutationRef<CreateProductData, CreateProductVariables>;
  operationName: string;
}
export const createProductRef: CreateProductRef;

export function createProduct(vars: CreateProductVariables): MutationPromise<CreateProductData, CreateProductVariables>;
export function createProduct(dc: DataConnect, vars: CreateProductVariables): MutationPromise<CreateProductData, CreateProductVariables>;

interface UpdateProductRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateProductVariables): MutationRef<UpdateProductData, UpdateProductVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateProductVariables): MutationRef<UpdateProductData, UpdateProductVariables>;
  operationName: string;
}
export const updateProductRef: UpdateProductRef;

export function updateProduct(vars: UpdateProductVariables): MutationPromise<UpdateProductData, UpdateProductVariables>;
export function updateProduct(dc: DataConnect, vars: UpdateProductVariables): MutationPromise<UpdateProductData, UpdateProductVariables>;

interface UpdateProductStockRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateProductStockVariables): MutationRef<UpdateProductStockData, UpdateProductStockVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateProductStockVariables): MutationRef<UpdateProductStockData, UpdateProductStockVariables>;
  operationName: string;
}
export const updateProductStockRef: UpdateProductStockRef;

export function updateProductStock(vars: UpdateProductStockVariables): MutationPromise<UpdateProductStockData, UpdateProductStockVariables>;
export function updateProductStock(dc: DataConnect, vars: UpdateProductStockVariables): MutationPromise<UpdateProductStockData, UpdateProductStockVariables>;

interface CreatePosTransactionRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreatePosTransactionVariables): MutationRef<CreatePosTransactionData, CreatePosTransactionVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreatePosTransactionVariables): MutationRef<CreatePosTransactionData, CreatePosTransactionVariables>;
  operationName: string;
}
export const createPosTransactionRef: CreatePosTransactionRef;

export function createPosTransaction(vars: CreatePosTransactionVariables): MutationPromise<CreatePosTransactionData, CreatePosTransactionVariables>;
export function createPosTransaction(dc: DataConnect, vars: CreatePosTransactionVariables): MutationPromise<CreatePosTransactionData, CreatePosTransactionVariables>;

interface GetStaffShiftsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetStaffShiftsVariables): QueryRef<GetStaffShiftsData, GetStaffShiftsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetStaffShiftsVariables): QueryRef<GetStaffShiftsData, GetStaffShiftsVariables>;
  operationName: string;
}
export const getStaffShiftsRef: GetStaffShiftsRef;

export function getStaffShifts(vars: GetStaffShiftsVariables, options?: ExecuteQueryOptions): QueryPromise<GetStaffShiftsData, GetStaffShiftsVariables>;
export function getStaffShifts(dc: DataConnect, vars: GetStaffShiftsVariables, options?: ExecuteQueryOptions): QueryPromise<GetStaffShiftsData, GetStaffShiftsVariables>;

interface CreateStaffShiftRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateStaffShiftVariables): MutationRef<CreateStaffShiftData, CreateStaffShiftVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateStaffShiftVariables): MutationRef<CreateStaffShiftData, CreateStaffShiftVariables>;
  operationName: string;
}
export const createStaffShiftRef: CreateStaffShiftRef;

export function createStaffShift(vars: CreateStaffShiftVariables): MutationPromise<CreateStaffShiftData, CreateStaffShiftVariables>;
export function createStaffShift(dc: DataConnect, vars: CreateStaffShiftVariables): MutationPromise<CreateStaffShiftData, CreateStaffShiftVariables>;

interface DeleteStaffShiftRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteStaffShiftVariables): MutationRef<DeleteStaffShiftData, DeleteStaffShiftVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteStaffShiftVariables): MutationRef<DeleteStaffShiftData, DeleteStaffShiftVariables>;
  operationName: string;
}
export const deleteStaffShiftRef: DeleteStaffShiftRef;

export function deleteStaffShift(vars: DeleteStaffShiftVariables): MutationPromise<DeleteStaffShiftData, DeleteStaffShiftVariables>;
export function deleteStaffShift(dc: DataConnect, vars: DeleteStaffShiftVariables): MutationPromise<DeleteStaffShiftData, DeleteStaffShiftVariables>;

interface GetUpcomingSlotsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetUpcomingSlotsVariables): QueryRef<GetUpcomingSlotsData, GetUpcomingSlotsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetUpcomingSlotsVariables): QueryRef<GetUpcomingSlotsData, GetUpcomingSlotsVariables>;
  operationName: string;
}
export const getUpcomingSlotsRef: GetUpcomingSlotsRef;

export function getUpcomingSlots(vars: GetUpcomingSlotsVariables, options?: ExecuteQueryOptions): QueryPromise<GetUpcomingSlotsData, GetUpcomingSlotsVariables>;
export function getUpcomingSlots(dc: DataConnect, vars: GetUpcomingSlotsVariables, options?: ExecuteQueryOptions): QueryPromise<GetUpcomingSlotsData, GetUpcomingSlotsVariables>;

interface GetAvailableSlotsForBookingRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetAvailableSlotsForBookingVariables): QueryRef<GetAvailableSlotsForBookingData, GetAvailableSlotsForBookingVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetAvailableSlotsForBookingVariables): QueryRef<GetAvailableSlotsForBookingData, GetAvailableSlotsForBookingVariables>;
  operationName: string;
}
export const getAvailableSlotsForBookingRef: GetAvailableSlotsForBookingRef;

export function getAvailableSlotsForBooking(vars: GetAvailableSlotsForBookingVariables, options?: ExecuteQueryOptions): QueryPromise<GetAvailableSlotsForBookingData, GetAvailableSlotsForBookingVariables>;
export function getAvailableSlotsForBooking(dc: DataConnect, vars: GetAvailableSlotsForBookingVariables, options?: ExecuteQueryOptions): QueryPromise<GetAvailableSlotsForBookingData, GetAvailableSlotsForBookingVariables>;

interface CreateSlotRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateSlotVariables): MutationRef<CreateSlotData, CreateSlotVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateSlotVariables): MutationRef<CreateSlotData, CreateSlotVariables>;
  operationName: string;
}
export const createSlotRef: CreateSlotRef;

export function createSlot(vars: CreateSlotVariables): MutationPromise<CreateSlotData, CreateSlotVariables>;
export function createSlot(dc: DataConnect, vars: CreateSlotVariables): MutationPromise<CreateSlotData, CreateSlotVariables>;

interface UpdateSlotStatusRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateSlotStatusVariables): MutationRef<UpdateSlotStatusData, UpdateSlotStatusVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateSlotStatusVariables): MutationRef<UpdateSlotStatusData, UpdateSlotStatusVariables>;
  operationName: string;
}
export const updateSlotStatusRef: UpdateSlotStatusRef;

export function updateSlotStatus(vars: UpdateSlotStatusVariables): MutationPromise<UpdateSlotStatusData, UpdateSlotStatusVariables>;
export function updateSlotStatus(dc: DataConnect, vars: UpdateSlotStatusVariables): MutationPromise<UpdateSlotStatusData, UpdateSlotStatusVariables>;

interface DeleteSlotRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteSlotVariables): MutationRef<DeleteSlotData, DeleteSlotVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteSlotVariables): MutationRef<DeleteSlotData, DeleteSlotVariables>;
  operationName: string;
}
export const deleteSlotRef: DeleteSlotRef;

export function deleteSlot(vars: DeleteSlotVariables): MutationPromise<DeleteSlotData, DeleteSlotVariables>;
export function deleteSlot(dc: DataConnect, vars: DeleteSlotVariables): MutationPromise<DeleteSlotData, DeleteSlotVariables>;

interface GetClassesRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetClassesVariables): QueryRef<GetClassesData, GetClassesVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetClassesVariables): QueryRef<GetClassesData, GetClassesVariables>;
  operationName: string;
}
export const getClassesRef: GetClassesRef;

export function getClasses(vars: GetClassesVariables, options?: ExecuteQueryOptions): QueryPromise<GetClassesData, GetClassesVariables>;
export function getClasses(dc: DataConnect, vars: GetClassesVariables, options?: ExecuteQueryOptions): QueryPromise<GetClassesData, GetClassesVariables>;

interface GetActiveClassesForBookingRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetActiveClassesForBookingVariables): QueryRef<GetActiveClassesForBookingData, GetActiveClassesForBookingVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetActiveClassesForBookingVariables): QueryRef<GetActiveClassesForBookingData, GetActiveClassesForBookingVariables>;
  operationName: string;
}
export const getActiveClassesForBookingRef: GetActiveClassesForBookingRef;

export function getActiveClassesForBooking(vars: GetActiveClassesForBookingVariables, options?: ExecuteQueryOptions): QueryPromise<GetActiveClassesForBookingData, GetActiveClassesForBookingVariables>;
export function getActiveClassesForBooking(dc: DataConnect, vars: GetActiveClassesForBookingVariables, options?: ExecuteQueryOptions): QueryPromise<GetActiveClassesForBookingData, GetActiveClassesForBookingVariables>;

interface CreateClassRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateClassVariables): MutationRef<CreateClassData, CreateClassVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateClassVariables): MutationRef<CreateClassData, CreateClassVariables>;
  operationName: string;
}
export const createClassRef: CreateClassRef;

export function createClass(vars: CreateClassVariables): MutationPromise<CreateClassData, CreateClassVariables>;
export function createClass(dc: DataConnect, vars: CreateClassVariables): MutationPromise<CreateClassData, CreateClassVariables>;

interface UpdateClassRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateClassVariables): MutationRef<UpdateClassData, UpdateClassVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateClassVariables): MutationRef<UpdateClassData, UpdateClassVariables>;
  operationName: string;
}
export const updateClassRef: UpdateClassRef;

export function updateClass(vars: UpdateClassVariables): MutationPromise<UpdateClassData, UpdateClassVariables>;
export function updateClass(dc: DataConnect, vars: UpdateClassVariables): MutationPromise<UpdateClassData, UpdateClassVariables>;

interface UpdateClassActiveStatusRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateClassActiveStatusVariables): MutationRef<UpdateClassActiveStatusData, UpdateClassActiveStatusVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateClassActiveStatusVariables): MutationRef<UpdateClassActiveStatusData, UpdateClassActiveStatusVariables>;
  operationName: string;
}
export const updateClassActiveStatusRef: UpdateClassActiveStatusRef;

export function updateClassActiveStatus(vars: UpdateClassActiveStatusVariables): MutationPromise<UpdateClassActiveStatusData, UpdateClassActiveStatusVariables>;
export function updateClassActiveStatus(dc: DataConnect, vars: UpdateClassActiveStatusVariables): MutationPromise<UpdateClassActiveStatusData, UpdateClassActiveStatusVariables>;

interface GetClassRegistrationsForReportsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetClassRegistrationsForReportsVariables): QueryRef<GetClassRegistrationsForReportsData, GetClassRegistrationsForReportsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetClassRegistrationsForReportsVariables): QueryRef<GetClassRegistrationsForReportsData, GetClassRegistrationsForReportsVariables>;
  operationName: string;
}
export const getClassRegistrationsForReportsRef: GetClassRegistrationsForReportsRef;

export function getClassRegistrationsForReports(vars: GetClassRegistrationsForReportsVariables, options?: ExecuteQueryOptions): QueryPromise<GetClassRegistrationsForReportsData, GetClassRegistrationsForReportsVariables>;
export function getClassRegistrationsForReports(dc: DataConnect, vars: GetClassRegistrationsForReportsVariables, options?: ExecuteQueryOptions): QueryPromise<GetClassRegistrationsForReportsData, GetClassRegistrationsForReportsVariables>;

interface GetClassesForReportsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetClassesForReportsVariables): QueryRef<GetClassesForReportsData, GetClassesForReportsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetClassesForReportsVariables): QueryRef<GetClassesForReportsData, GetClassesForReportsVariables>;
  operationName: string;
}
export const getClassesForReportsRef: GetClassesForReportsRef;

export function getClassesForReports(vars: GetClassesForReportsVariables, options?: ExecuteQueryOptions): QueryPromise<GetClassesForReportsData, GetClassesForReportsVariables>;
export function getClassesForReports(dc: DataConnect, vars: GetClassesForReportsVariables, options?: ExecuteQueryOptions): QueryPromise<GetClassesForReportsData, GetClassesForReportsVariables>;

interface GetExistingRegistrationRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetExistingRegistrationVariables): QueryRef<GetExistingRegistrationData, GetExistingRegistrationVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetExistingRegistrationVariables): QueryRef<GetExistingRegistrationData, GetExistingRegistrationVariables>;
  operationName: string;
}
export const getExistingRegistrationRef: GetExistingRegistrationRef;

export function getExistingRegistration(vars: GetExistingRegistrationVariables, options?: ExecuteQueryOptions): QueryPromise<GetExistingRegistrationData, GetExistingRegistrationVariables>;
export function getExistingRegistration(dc: DataConnect, vars: GetExistingRegistrationVariables, options?: ExecuteQueryOptions): QueryPromise<GetExistingRegistrationData, GetExistingRegistrationVariables>;

interface GetClassRegistrationsCountRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetClassRegistrationsCountVariables): QueryRef<GetClassRegistrationsCountData, GetClassRegistrationsCountVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetClassRegistrationsCountVariables): QueryRef<GetClassRegistrationsCountData, GetClassRegistrationsCountVariables>;
  operationName: string;
}
export const getClassRegistrationsCountRef: GetClassRegistrationsCountRef;

export function getClassRegistrationsCount(vars: GetClassRegistrationsCountVariables, options?: ExecuteQueryOptions): QueryPromise<GetClassRegistrationsCountData, GetClassRegistrationsCountVariables>;
export function getClassRegistrationsCount(dc: DataConnect, vars: GetClassRegistrationsCountVariables, options?: ExecuteQueryOptions): QueryPromise<GetClassRegistrationsCountData, GetClassRegistrationsCountVariables>;

interface CreateClassRegistrationRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateClassRegistrationVariables): MutationRef<CreateClassRegistrationData, CreateClassRegistrationVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateClassRegistrationVariables): MutationRef<CreateClassRegistrationData, CreateClassRegistrationVariables>;
  operationName: string;
}
export const createClassRegistrationRef: CreateClassRegistrationRef;

export function createClassRegistration(vars: CreateClassRegistrationVariables): MutationPromise<CreateClassRegistrationData, CreateClassRegistrationVariables>;
export function createClassRegistration(dc: DataConnect, vars: CreateClassRegistrationVariables): MutationPromise<CreateClassRegistrationData, CreateClassRegistrationVariables>;

interface GetWidgetConfigRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetWidgetConfigVariables): QueryRef<GetWidgetConfigData, GetWidgetConfigVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetWidgetConfigVariables): QueryRef<GetWidgetConfigData, GetWidgetConfigVariables>;
  operationName: string;
}
export const getWidgetConfigRef: GetWidgetConfigRef;

export function getWidgetConfig(vars: GetWidgetConfigVariables, options?: ExecuteQueryOptions): QueryPromise<GetWidgetConfigData, GetWidgetConfigVariables>;
export function getWidgetConfig(dc: DataConnect, vars: GetWidgetConfigVariables, options?: ExecuteQueryOptions): QueryPromise<GetWidgetConfigData, GetWidgetConfigVariables>;

interface UpsertWidgetConfigRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertWidgetConfigVariables): MutationRef<UpsertWidgetConfigData, UpsertWidgetConfigVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpsertWidgetConfigVariables): MutationRef<UpsertWidgetConfigData, UpsertWidgetConfigVariables>;
  operationName: string;
}
export const upsertWidgetConfigRef: UpsertWidgetConfigRef;

export function upsertWidgetConfig(vars: UpsertWidgetConfigVariables): MutationPromise<UpsertWidgetConfigData, UpsertWidgetConfigVariables>;
export function upsertWidgetConfig(dc: DataConnect, vars: UpsertWidgetConfigVariables): MutationPromise<UpsertWidgetConfigData, UpsertWidgetConfigVariables>;

interface GetAppointmentsForReportsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetAppointmentsForReportsVariables): QueryRef<GetAppointmentsForReportsData, GetAppointmentsForReportsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetAppointmentsForReportsVariables): QueryRef<GetAppointmentsForReportsData, GetAppointmentsForReportsVariables>;
  operationName: string;
}
export const getAppointmentsForReportsRef: GetAppointmentsForReportsRef;

export function getAppointmentsForReports(vars: GetAppointmentsForReportsVariables, options?: ExecuteQueryOptions): QueryPromise<GetAppointmentsForReportsData, GetAppointmentsForReportsVariables>;
export function getAppointmentsForReports(dc: DataConnect, vars: GetAppointmentsForReportsVariables, options?: ExecuteQueryOptions): QueryPromise<GetAppointmentsForReportsData, GetAppointmentsForReportsVariables>;

interface GetClientsForReportsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetClientsForReportsVariables): QueryRef<GetClientsForReportsData, GetClientsForReportsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetClientsForReportsVariables): QueryRef<GetClientsForReportsData, GetClientsForReportsVariables>;
  operationName: string;
}
export const getClientsForReportsRef: GetClientsForReportsRef;

export function getClientsForReports(vars: GetClientsForReportsVariables, options?: ExecuteQueryOptions): QueryPromise<GetClientsForReportsData, GetClientsForReportsVariables>;
export function getClientsForReports(dc: DataConnect, vars: GetClientsForReportsVariables, options?: ExecuteQueryOptions): QueryPromise<GetClientsForReportsData, GetClientsForReportsVariables>;

interface UpdateProfileInfoRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateProfileInfoVariables): MutationRef<UpdateProfileInfoData, UpdateProfileInfoVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateProfileInfoVariables): MutationRef<UpdateProfileInfoData, UpdateProfileInfoVariables>;
  operationName: string;
}
export const updateProfileInfoRef: UpdateProfileInfoRef;

export function updateProfileInfo(vars: UpdateProfileInfoVariables): MutationPromise<UpdateProfileInfoData, UpdateProfileInfoVariables>;
export function updateProfileInfo(dc: DataConnect, vars: UpdateProfileInfoVariables): MutationPromise<UpdateProfileInfoData, UpdateProfileInfoVariables>;

interface GetActiveIntakeTemplatesRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetActiveIntakeTemplatesVariables): QueryRef<GetActiveIntakeTemplatesData, GetActiveIntakeTemplatesVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetActiveIntakeTemplatesVariables): QueryRef<GetActiveIntakeTemplatesData, GetActiveIntakeTemplatesVariables>;
  operationName: string;
}
export const getActiveIntakeTemplatesRef: GetActiveIntakeTemplatesRef;

export function getActiveIntakeTemplates(vars: GetActiveIntakeTemplatesVariables, options?: ExecuteQueryOptions): QueryPromise<GetActiveIntakeTemplatesData, GetActiveIntakeTemplatesVariables>;
export function getActiveIntakeTemplates(dc: DataConnect, vars: GetActiveIntakeTemplatesVariables, options?: ExecuteQueryOptions): QueryPromise<GetActiveIntakeTemplatesData, GetActiveIntakeTemplatesVariables>;

interface GetIntakeSubmissionsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetIntakeSubmissionsVariables): QueryRef<GetIntakeSubmissionsData, GetIntakeSubmissionsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetIntakeSubmissionsVariables): QueryRef<GetIntakeSubmissionsData, GetIntakeSubmissionsVariables>;
  operationName: string;
}
export const getIntakeSubmissionsRef: GetIntakeSubmissionsRef;

export function getIntakeSubmissions(vars: GetIntakeSubmissionsVariables, options?: ExecuteQueryOptions): QueryPromise<GetIntakeSubmissionsData, GetIntakeSubmissionsVariables>;
export function getIntakeSubmissions(dc: DataConnect, vars: GetIntakeSubmissionsVariables, options?: ExecuteQueryOptions): QueryPromise<GetIntakeSubmissionsData, GetIntakeSubmissionsVariables>;

interface CreateIntakeSubmissionRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateIntakeSubmissionVariables): MutationRef<CreateIntakeSubmissionData, CreateIntakeSubmissionVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateIntakeSubmissionVariables): MutationRef<CreateIntakeSubmissionData, CreateIntakeSubmissionVariables>;
  operationName: string;
}
export const createIntakeSubmissionRef: CreateIntakeSubmissionRef;

export function createIntakeSubmission(vars: CreateIntakeSubmissionVariables): MutationPromise<CreateIntakeSubmissionData, CreateIntakeSubmissionVariables>;
export function createIntakeSubmission(dc: DataConnect, vars: CreateIntakeSubmissionVariables): MutationPromise<CreateIntakeSubmissionData, CreateIntakeSubmissionVariables>;

interface GetClientDocumentsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetClientDocumentsVariables): QueryRef<GetClientDocumentsData, GetClientDocumentsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetClientDocumentsVariables): QueryRef<GetClientDocumentsData, GetClientDocumentsVariables>;
  operationName: string;
}
export const getClientDocumentsRef: GetClientDocumentsRef;

export function getClientDocuments(vars: GetClientDocumentsVariables, options?: ExecuteQueryOptions): QueryPromise<GetClientDocumentsData, GetClientDocumentsVariables>;
export function getClientDocuments(dc: DataConnect, vars: GetClientDocumentsVariables, options?: ExecuteQueryOptions): QueryPromise<GetClientDocumentsData, GetClientDocumentsVariables>;

interface UpdateClientPackageSessionsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateClientPackageSessionsVariables): MutationRef<UpdateClientPackageSessionsData, UpdateClientPackageSessionsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateClientPackageSessionsVariables): MutationRef<UpdateClientPackageSessionsData, UpdateClientPackageSessionsVariables>;
  operationName: string;
}
export const updateClientPackageSessionsRef: UpdateClientPackageSessionsRef;

export function updateClientPackageSessions(vars: UpdateClientPackageSessionsVariables): MutationPromise<UpdateClientPackageSessionsData, UpdateClientPackageSessionsVariables>;
export function updateClientPackageSessions(dc: DataConnect, vars: UpdateClientPackageSessionsVariables): MutationPromise<UpdateClientPackageSessionsData, UpdateClientPackageSessionsVariables>;

interface GetAnnouncementsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetAnnouncementsVariables): QueryRef<GetAnnouncementsData, GetAnnouncementsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetAnnouncementsVariables): QueryRef<GetAnnouncementsData, GetAnnouncementsVariables>;
  operationName: string;
}
export const getAnnouncementsRef: GetAnnouncementsRef;

export function getAnnouncements(vars: GetAnnouncementsVariables, options?: ExecuteQueryOptions): QueryPromise<GetAnnouncementsData, GetAnnouncementsVariables>;
export function getAnnouncements(dc: DataConnect, vars: GetAnnouncementsVariables, options?: ExecuteQueryOptions): QueryPromise<GetAnnouncementsData, GetAnnouncementsVariables>;

interface CreateAnnouncementRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateAnnouncementVariables): MutationRef<CreateAnnouncementData, CreateAnnouncementVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateAnnouncementVariables): MutationRef<CreateAnnouncementData, CreateAnnouncementVariables>;
  operationName: string;
}
export const createAnnouncementRef: CreateAnnouncementRef;

export function createAnnouncement(vars: CreateAnnouncementVariables): MutationPromise<CreateAnnouncementData, CreateAnnouncementVariables>;
export function createAnnouncement(dc: DataConnect, vars: CreateAnnouncementVariables): MutationPromise<CreateAnnouncementData, CreateAnnouncementVariables>;

interface DeleteAnnouncementRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteAnnouncementVariables): MutationRef<DeleteAnnouncementData, DeleteAnnouncementVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteAnnouncementVariables): MutationRef<DeleteAnnouncementData, DeleteAnnouncementVariables>;
  operationName: string;
}
export const deleteAnnouncementRef: DeleteAnnouncementRef;

export function deleteAnnouncement(vars: DeleteAnnouncementVariables): MutationPromise<DeleteAnnouncementData, DeleteAnnouncementVariables>;
export function deleteAnnouncement(dc: DataConnect, vars: DeleteAnnouncementVariables): MutationPromise<DeleteAnnouncementData, DeleteAnnouncementVariables>;

interface GetClassRegistrationsForAttendanceRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetClassRegistrationsForAttendanceVariables): QueryRef<GetClassRegistrationsForAttendanceData, GetClassRegistrationsForAttendanceVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetClassRegistrationsForAttendanceVariables): QueryRef<GetClassRegistrationsForAttendanceData, GetClassRegistrationsForAttendanceVariables>;
  operationName: string;
}
export const getClassRegistrationsForAttendanceRef: GetClassRegistrationsForAttendanceRef;

export function getClassRegistrationsForAttendance(vars: GetClassRegistrationsForAttendanceVariables, options?: ExecuteQueryOptions): QueryPromise<GetClassRegistrationsForAttendanceData, GetClassRegistrationsForAttendanceVariables>;
export function getClassRegistrationsForAttendance(dc: DataConnect, vars: GetClassRegistrationsForAttendanceVariables, options?: ExecuteQueryOptions): QueryPromise<GetClassRegistrationsForAttendanceData, GetClassRegistrationsForAttendanceVariables>;

interface UpdateClassRegistrationStatusRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateClassRegistrationStatusVariables): MutationRef<UpdateClassRegistrationStatusData, UpdateClassRegistrationStatusVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateClassRegistrationStatusVariables): MutationRef<UpdateClassRegistrationStatusData, UpdateClassRegistrationStatusVariables>;
  operationName: string;
}
export const updateClassRegistrationStatusRef: UpdateClassRegistrationStatusRef;

export function updateClassRegistrationStatus(vars: UpdateClassRegistrationStatusVariables): MutationPromise<UpdateClassRegistrationStatusData, UpdateClassRegistrationStatusVariables>;
export function updateClassRegistrationStatus(dc: DataConnect, vars: UpdateClassRegistrationStatusVariables): MutationPromise<UpdateClassRegistrationStatusData, UpdateClassRegistrationStatusVariables>;

interface GetClientsForRetentionRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetClientsForRetentionVariables): QueryRef<GetClientsForRetentionData, GetClientsForRetentionVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetClientsForRetentionVariables): QueryRef<GetClientsForRetentionData, GetClientsForRetentionVariables>;
  operationName: string;
}
export const getClientsForRetentionRef: GetClientsForRetentionRef;

export function getClientsForRetention(vars: GetClientsForRetentionVariables, options?: ExecuteQueryOptions): QueryPromise<GetClientsForRetentionData, GetClientsForRetentionVariables>;
export function getClientsForRetention(dc: DataConnect, vars: GetClientsForRetentionVariables, options?: ExecuteQueryOptions): QueryPromise<GetClientsForRetentionData, GetClientsForRetentionVariables>;

interface GetCompletedAppointmentsForRetentionRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetCompletedAppointmentsForRetentionVariables): QueryRef<GetCompletedAppointmentsForRetentionData, GetCompletedAppointmentsForRetentionVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetCompletedAppointmentsForRetentionVariables): QueryRef<GetCompletedAppointmentsForRetentionData, GetCompletedAppointmentsForRetentionVariables>;
  operationName: string;
}
export const getCompletedAppointmentsForRetentionRef: GetCompletedAppointmentsForRetentionRef;

export function getCompletedAppointmentsForRetention(vars: GetCompletedAppointmentsForRetentionVariables, options?: ExecuteQueryOptions): QueryPromise<GetCompletedAppointmentsForRetentionData, GetCompletedAppointmentsForRetentionVariables>;
export function getCompletedAppointmentsForRetention(dc: DataConnect, vars: GetCompletedAppointmentsForRetentionVariables, options?: ExecuteQueryOptions): QueryPromise<GetCompletedAppointmentsForRetentionData, GetCompletedAppointmentsForRetentionVariables>;

interface GetOrgClientPackagesRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetOrgClientPackagesVariables): QueryRef<GetOrgClientPackagesData, GetOrgClientPackagesVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetOrgClientPackagesVariables): QueryRef<GetOrgClientPackagesData, GetOrgClientPackagesVariables>;
  operationName: string;
}
export const getOrgClientPackagesRef: GetOrgClientPackagesRef;

export function getOrgClientPackages(vars: GetOrgClientPackagesVariables, options?: ExecuteQueryOptions): QueryPromise<GetOrgClientPackagesData, GetOrgClientPackagesVariables>;
export function getOrgClientPackages(dc: DataConnect, vars: GetOrgClientPackagesVariables, options?: ExecuteQueryOptions): QueryPromise<GetOrgClientPackagesData, GetOrgClientPackagesVariables>;

interface GetFloorLayoutRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetFloorLayoutVariables): QueryRef<GetFloorLayoutData, GetFloorLayoutVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetFloorLayoutVariables): QueryRef<GetFloorLayoutData, GetFloorLayoutVariables>;
  operationName: string;
}
export const getFloorLayoutRef: GetFloorLayoutRef;

export function getFloorLayout(vars: GetFloorLayoutVariables, options?: ExecuteQueryOptions): QueryPromise<GetFloorLayoutData, GetFloorLayoutVariables>;
export function getFloorLayout(dc: DataConnect, vars: GetFloorLayoutVariables, options?: ExecuteQueryOptions): QueryPromise<GetFloorLayoutData, GetFloorLayoutVariables>;

interface AssignSeatRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: AssignSeatVariables): MutationRef<AssignSeatData, AssignSeatVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: AssignSeatVariables): MutationRef<AssignSeatData, AssignSeatVariables>;
  operationName: string;
}
export const assignSeatRef: AssignSeatRef;

export function assignSeat(vars: AssignSeatVariables): MutationPromise<AssignSeatData, AssignSeatVariables>;
export function assignSeat(dc: DataConnect, vars: AssignSeatVariables): MutationPromise<AssignSeatData, AssignSeatVariables>;

interface ClearSeatRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ClearSeatVariables): MutationRef<ClearSeatData, ClearSeatVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ClearSeatVariables): MutationRef<ClearSeatData, ClearSeatVariables>;
  operationName: string;
}
export const clearSeatRef: ClearSeatRef;

export function clearSeat(vars: ClearSeatVariables): MutationPromise<ClearSeatData, ClearSeatVariables>;
export function clearSeat(dc: DataConnect, vars: ClearSeatVariables): MutationPromise<ClearSeatData, ClearSeatVariables>;

interface GetTodayFloorAppointmentsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetTodayFloorAppointmentsVariables): QueryRef<GetTodayFloorAppointmentsData, GetTodayFloorAppointmentsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetTodayFloorAppointmentsVariables): QueryRef<GetTodayFloorAppointmentsData, GetTodayFloorAppointmentsVariables>;
  operationName: string;
}
export const getTodayFloorAppointmentsRef: GetTodayFloorAppointmentsRef;

export function getTodayFloorAppointments(vars: GetTodayFloorAppointmentsVariables, options?: ExecuteQueryOptions): QueryPromise<GetTodayFloorAppointmentsData, GetTodayFloorAppointmentsVariables>;
export function getTodayFloorAppointments(dc: DataConnect, vars: GetTodayFloorAppointmentsVariables, options?: ExecuteQueryOptions): QueryPromise<GetTodayFloorAppointmentsData, GetTodayFloorAppointmentsVariables>;

interface GetUnconfirmedAppointmentsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetUnconfirmedAppointmentsVariables): QueryRef<GetUnconfirmedAppointmentsData, GetUnconfirmedAppointmentsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetUnconfirmedAppointmentsVariables): QueryRef<GetUnconfirmedAppointmentsData, GetUnconfirmedAppointmentsVariables>;
  operationName: string;
}
export const getUnconfirmedAppointmentsRef: GetUnconfirmedAppointmentsRef;

export function getUnconfirmedAppointments(vars: GetUnconfirmedAppointmentsVariables, options?: ExecuteQueryOptions): QueryPromise<GetUnconfirmedAppointmentsData, GetUnconfirmedAppointmentsVariables>;
export function getUnconfirmedAppointments(dc: DataConnect, vars: GetUnconfirmedAppointmentsVariables, options?: ExecuteQueryOptions): QueryPromise<GetUnconfirmedAppointmentsData, GetUnconfirmedAppointmentsVariables>;

interface GetPendingOrgBookingsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetPendingOrgBookingsVariables): QueryRef<GetPendingOrgBookingsData, GetPendingOrgBookingsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetPendingOrgBookingsVariables): QueryRef<GetPendingOrgBookingsData, GetPendingOrgBookingsVariables>;
  operationName: string;
}
export const getPendingOrgBookingsRef: GetPendingOrgBookingsRef;

export function getPendingOrgBookings(vars: GetPendingOrgBookingsVariables, options?: ExecuteQueryOptions): QueryPromise<GetPendingOrgBookingsData, GetPendingOrgBookingsVariables>;
export function getPendingOrgBookings(dc: DataConnect, vars: GetPendingOrgBookingsVariables, options?: ExecuteQueryOptions): QueryPromise<GetPendingOrgBookingsData, GetPendingOrgBookingsVariables>;

interface GetOrgWaitlistRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetOrgWaitlistVariables): QueryRef<GetOrgWaitlistData, GetOrgWaitlistVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetOrgWaitlistVariables): QueryRef<GetOrgWaitlistData, GetOrgWaitlistVariables>;
  operationName: string;
}
export const getOrgWaitlistRef: GetOrgWaitlistRef;

export function getOrgWaitlist(vars: GetOrgWaitlistVariables, options?: ExecuteQueryOptions): QueryPromise<GetOrgWaitlistData, GetOrgWaitlistVariables>;
export function getOrgWaitlist(dc: DataConnect, vars: GetOrgWaitlistVariables, options?: ExecuteQueryOptions): QueryPromise<GetOrgWaitlistData, GetOrgWaitlistVariables>;

interface GetOrgActivityLogsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetOrgActivityLogsVariables): QueryRef<GetOrgActivityLogsData, GetOrgActivityLogsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetOrgActivityLogsVariables): QueryRef<GetOrgActivityLogsData, GetOrgActivityLogsVariables>;
  operationName: string;
}
export const getOrgActivityLogsRef: GetOrgActivityLogsRef;

export function getOrgActivityLogs(vars: GetOrgActivityLogsVariables, options?: ExecuteQueryOptions): QueryPromise<GetOrgActivityLogsData, GetOrgActivityLogsVariables>;
export function getOrgActivityLogs(dc: DataConnect, vars: GetOrgActivityLogsVariables, options?: ExecuteQueryOptions): QueryPromise<GetOrgActivityLogsData, GetOrgActivityLogsVariables>;

interface GetOrgPosTransactionsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetOrgPosTransactionsVariables): QueryRef<GetOrgPosTransactionsData, GetOrgPosTransactionsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetOrgPosTransactionsVariables): QueryRef<GetOrgPosTransactionsData, GetOrgPosTransactionsVariables>;
  operationName: string;
}
export const getOrgPosTransactionsRef: GetOrgPosTransactionsRef;

export function getOrgPosTransactions(vars: GetOrgPosTransactionsVariables, options?: ExecuteQueryOptions): QueryPromise<GetOrgPosTransactionsData, GetOrgPosTransactionsVariables>;
export function getOrgPosTransactions(dc: DataConnect, vars: GetOrgPosTransactionsVariables, options?: ExecuteQueryOptions): QueryPromise<GetOrgPosTransactionsData, GetOrgPosTransactionsVariables>;

interface GetOrgByIdRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetOrgByIdVariables): QueryRef<GetOrgByIdData, GetOrgByIdVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetOrgByIdVariables): QueryRef<GetOrgByIdData, GetOrgByIdVariables>;
  operationName: string;
}
export const getOrgByIdRef: GetOrgByIdRef;

export function getOrgById(vars: GetOrgByIdVariables, options?: ExecuteQueryOptions): QueryPromise<GetOrgByIdData, GetOrgByIdVariables>;
export function getOrgById(dc: DataConnect, vars: GetOrgByIdVariables, options?: ExecuteQueryOptions): QueryPromise<GetOrgByIdData, GetOrgByIdVariables>;

interface UpdateOrgStripeCredentialsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateOrgStripeCredentialsVariables): MutationRef<UpdateOrgStripeCredentialsData, UpdateOrgStripeCredentialsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateOrgStripeCredentialsVariables): MutationRef<UpdateOrgStripeCredentialsData, UpdateOrgStripeCredentialsVariables>;
  operationName: string;
}
export const updateOrgStripeCredentialsRef: UpdateOrgStripeCredentialsRef;

export function updateOrgStripeCredentials(vars: UpdateOrgStripeCredentialsVariables): MutationPromise<UpdateOrgStripeCredentialsData, UpdateOrgStripeCredentialsVariables>;
export function updateOrgStripeCredentials(dc: DataConnect, vars: UpdateOrgStripeCredentialsVariables): MutationPromise<UpdateOrgStripeCredentialsData, UpdateOrgStripeCredentialsVariables>;

interface UpdateProfileCommissionRateRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateProfileCommissionRateVariables): MutationRef<UpdateProfileCommissionRateData, UpdateProfileCommissionRateVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateProfileCommissionRateVariables): MutationRef<UpdateProfileCommissionRateData, UpdateProfileCommissionRateVariables>;
  operationName: string;
}
export const updateProfileCommissionRateRef: UpdateProfileCommissionRateRef;

export function updateProfileCommissionRate(vars: UpdateProfileCommissionRateVariables): MutationPromise<UpdateProfileCommissionRateData, UpdateProfileCommissionRateVariables>;
export function updateProfileCommissionRate(dc: DataConnect, vars: UpdateProfileCommissionRateVariables): MutationPromise<UpdateProfileCommissionRateData, UpdateProfileCommissionRateVariables>;

interface GetOrgIntakeTemplatesRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetOrgIntakeTemplatesVariables): QueryRef<GetOrgIntakeTemplatesData, GetOrgIntakeTemplatesVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetOrgIntakeTemplatesVariables): QueryRef<GetOrgIntakeTemplatesData, GetOrgIntakeTemplatesVariables>;
  operationName: string;
}
export const getOrgIntakeTemplatesRef: GetOrgIntakeTemplatesRef;

export function getOrgIntakeTemplates(vars: GetOrgIntakeTemplatesVariables, options?: ExecuteQueryOptions): QueryPromise<GetOrgIntakeTemplatesData, GetOrgIntakeTemplatesVariables>;
export function getOrgIntakeTemplates(dc: DataConnect, vars: GetOrgIntakeTemplatesVariables, options?: ExecuteQueryOptions): QueryPromise<GetOrgIntakeTemplatesData, GetOrgIntakeTemplatesVariables>;

interface CreateIntakeTemplateRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateIntakeTemplateVariables): MutationRef<CreateIntakeTemplateData, CreateIntakeTemplateVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateIntakeTemplateVariables): MutationRef<CreateIntakeTemplateData, CreateIntakeTemplateVariables>;
  operationName: string;
}
export const createIntakeTemplateRef: CreateIntakeTemplateRef;

export function createIntakeTemplate(vars: CreateIntakeTemplateVariables): MutationPromise<CreateIntakeTemplateData, CreateIntakeTemplateVariables>;
export function createIntakeTemplate(dc: DataConnect, vars: CreateIntakeTemplateVariables): MutationPromise<CreateIntakeTemplateData, CreateIntakeTemplateVariables>;

interface UpdateIntakeTemplateRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateIntakeTemplateVariables): MutationRef<UpdateIntakeTemplateData, UpdateIntakeTemplateVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateIntakeTemplateVariables): MutationRef<UpdateIntakeTemplateData, UpdateIntakeTemplateVariables>;
  operationName: string;
}
export const updateIntakeTemplateRef: UpdateIntakeTemplateRef;

export function updateIntakeTemplate(vars: UpdateIntakeTemplateVariables): MutationPromise<UpdateIntakeTemplateData, UpdateIntakeTemplateVariables>;
export function updateIntakeTemplate(dc: DataConnect, vars: UpdateIntakeTemplateVariables): MutationPromise<UpdateIntakeTemplateData, UpdateIntakeTemplateVariables>;

interface DeleteIntakeTemplateRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteIntakeTemplateVariables): MutationRef<DeleteIntakeTemplateData, DeleteIntakeTemplateVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteIntakeTemplateVariables): MutationRef<DeleteIntakeTemplateData, DeleteIntakeTemplateVariables>;
  operationName: string;
}
export const deleteIntakeTemplateRef: DeleteIntakeTemplateRef;

export function deleteIntakeTemplate(vars: DeleteIntakeTemplateVariables): MutationPromise<DeleteIntakeTemplateData, DeleteIntakeTemplateVariables>;
export function deleteIntakeTemplate(dc: DataConnect, vars: DeleteIntakeTemplateVariables): MutationPromise<DeleteIntakeTemplateData, DeleteIntakeTemplateVariables>;

interface GetOrgServicesRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetOrgServicesVariables): QueryRef<GetOrgServicesData, GetOrgServicesVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetOrgServicesVariables): QueryRef<GetOrgServicesData, GetOrgServicesVariables>;
  operationName: string;
}
export const getOrgServicesRef: GetOrgServicesRef;

export function getOrgServices(vars: GetOrgServicesVariables, options?: ExecuteQueryOptions): QueryPromise<GetOrgServicesData, GetOrgServicesVariables>;
export function getOrgServices(dc: DataConnect, vars: GetOrgServicesVariables, options?: ExecuteQueryOptions): QueryPromise<GetOrgServicesData, GetOrgServicesVariables>;

interface UpdateServiceRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateServiceVariables): MutationRef<UpdateServiceData, UpdateServiceVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateServiceVariables): MutationRef<UpdateServiceData, UpdateServiceVariables>;
  operationName: string;
}
export const updateServiceRef: UpdateServiceRef;

export function updateService(vars: UpdateServiceVariables): MutationPromise<UpdateServiceData, UpdateServiceVariables>;
export function updateService(dc: DataConnect, vars: UpdateServiceVariables): MutationPromise<UpdateServiceData, UpdateServiceVariables>;

interface ToggleServiceArchiveRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ToggleServiceArchiveVariables): MutationRef<ToggleServiceArchiveData, ToggleServiceArchiveVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ToggleServiceArchiveVariables): MutationRef<ToggleServiceArchiveData, ToggleServiceArchiveVariables>;
  operationName: string;
}
export const toggleServiceArchiveRef: ToggleServiceArchiveRef;

export function toggleServiceArchive(vars: ToggleServiceArchiveVariables): MutationPromise<ToggleServiceArchiveData, ToggleServiceArchiveVariables>;
export function toggleServiceArchive(dc: DataConnect, vars: ToggleServiceArchiveVariables): MutationPromise<ToggleServiceArchiveData, ToggleServiceArchiveVariables>;

interface GetMarketingTriggersRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetMarketingTriggersVariables): QueryRef<GetMarketingTriggersData, GetMarketingTriggersVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetMarketingTriggersVariables): QueryRef<GetMarketingTriggersData, GetMarketingTriggersVariables>;
  operationName: string;
}
export const getMarketingTriggersRef: GetMarketingTriggersRef;

export function getMarketingTriggers(vars: GetMarketingTriggersVariables, options?: ExecuteQueryOptions): QueryPromise<GetMarketingTriggersData, GetMarketingTriggersVariables>;
export function getMarketingTriggers(dc: DataConnect, vars: GetMarketingTriggersVariables, options?: ExecuteQueryOptions): QueryPromise<GetMarketingTriggersData, GetMarketingTriggersVariables>;

interface CreateMarketingTriggerRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateMarketingTriggerVariables): MutationRef<CreateMarketingTriggerData, CreateMarketingTriggerVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateMarketingTriggerVariables): MutationRef<CreateMarketingTriggerData, CreateMarketingTriggerVariables>;
  operationName: string;
}
export const createMarketingTriggerRef: CreateMarketingTriggerRef;

export function createMarketingTrigger(vars: CreateMarketingTriggerVariables): MutationPromise<CreateMarketingTriggerData, CreateMarketingTriggerVariables>;
export function createMarketingTrigger(dc: DataConnect, vars: CreateMarketingTriggerVariables): MutationPromise<CreateMarketingTriggerData, CreateMarketingTriggerVariables>;

interface UpdateMarketingTriggerRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateMarketingTriggerVariables): MutationRef<UpdateMarketingTriggerData, UpdateMarketingTriggerVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateMarketingTriggerVariables): MutationRef<UpdateMarketingTriggerData, UpdateMarketingTriggerVariables>;
  operationName: string;
}
export const updateMarketingTriggerRef: UpdateMarketingTriggerRef;

export function updateMarketingTrigger(vars: UpdateMarketingTriggerVariables): MutationPromise<UpdateMarketingTriggerData, UpdateMarketingTriggerVariables>;
export function updateMarketingTrigger(dc: DataConnect, vars: UpdateMarketingTriggerVariables): MutationPromise<UpdateMarketingTriggerData, UpdateMarketingTriggerVariables>;

interface GetNotificationSettingsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetNotificationSettingsVariables): QueryRef<GetNotificationSettingsData, GetNotificationSettingsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetNotificationSettingsVariables): QueryRef<GetNotificationSettingsData, GetNotificationSettingsVariables>;
  operationName: string;
}
export const getNotificationSettingsRef: GetNotificationSettingsRef;

export function getNotificationSettings(vars: GetNotificationSettingsVariables, options?: ExecuteQueryOptions): QueryPromise<GetNotificationSettingsData, GetNotificationSettingsVariables>;
export function getNotificationSettings(dc: DataConnect, vars: GetNotificationSettingsVariables, options?: ExecuteQueryOptions): QueryPromise<GetNotificationSettingsData, GetNotificationSettingsVariables>;

interface UpsertNotificationSettingsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertNotificationSettingsVariables): MutationRef<UpsertNotificationSettingsData, UpsertNotificationSettingsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpsertNotificationSettingsVariables): MutationRef<UpsertNotificationSettingsData, UpsertNotificationSettingsVariables>;
  operationName: string;
}
export const upsertNotificationSettingsRef: UpsertNotificationSettingsRef;

export function upsertNotificationSettings(vars: UpsertNotificationSettingsVariables): MutationPromise<UpsertNotificationSettingsData, UpsertNotificationSettingsVariables>;
export function upsertNotificationSettings(dc: DataConnect, vars: UpsertNotificationSettingsVariables): MutationPromise<UpsertNotificationSettingsData, UpsertNotificationSettingsVariables>;

interface UpdateOrgPatientCheckinRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateOrgPatientCheckinVariables): MutationRef<UpdateOrgPatientCheckinData, UpdateOrgPatientCheckinVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateOrgPatientCheckinVariables): MutationRef<UpdateOrgPatientCheckinData, UpdateOrgPatientCheckinVariables>;
  operationName: string;
}
export const updateOrgPatientCheckinRef: UpdateOrgPatientCheckinRef;

export function updateOrgPatientCheckin(vars: UpdateOrgPatientCheckinVariables): MutationPromise<UpdateOrgPatientCheckinData, UpdateOrgPatientCheckinVariables>;
export function updateOrgPatientCheckin(dc: DataConnect, vars: UpdateOrgPatientCheckinVariables): MutationPromise<UpdateOrgPatientCheckinData, UpdateOrgPatientCheckinVariables>;

interface GetOrgPackageTemplatesRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetOrgPackageTemplatesVariables): QueryRef<GetOrgPackageTemplatesData, GetOrgPackageTemplatesVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetOrgPackageTemplatesVariables): QueryRef<GetOrgPackageTemplatesData, GetOrgPackageTemplatesVariables>;
  operationName: string;
}
export const getOrgPackageTemplatesRef: GetOrgPackageTemplatesRef;

export function getOrgPackageTemplates(vars: GetOrgPackageTemplatesVariables, options?: ExecuteQueryOptions): QueryPromise<GetOrgPackageTemplatesData, GetOrgPackageTemplatesVariables>;
export function getOrgPackageTemplates(dc: DataConnect, vars: GetOrgPackageTemplatesVariables, options?: ExecuteQueryOptions): QueryPromise<GetOrgPackageTemplatesData, GetOrgPackageTemplatesVariables>;

interface CreatePackageTemplateRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreatePackageTemplateVariables): MutationRef<CreatePackageTemplateData, CreatePackageTemplateVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreatePackageTemplateVariables): MutationRef<CreatePackageTemplateData, CreatePackageTemplateVariables>;
  operationName: string;
}
export const createPackageTemplateRef: CreatePackageTemplateRef;

export function createPackageTemplate(vars: CreatePackageTemplateVariables): MutationPromise<CreatePackageTemplateData, CreatePackageTemplateVariables>;
export function createPackageTemplate(dc: DataConnect, vars: CreatePackageTemplateVariables): MutationPromise<CreatePackageTemplateData, CreatePackageTemplateVariables>;

interface UpdatePackageTemplateRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdatePackageTemplateVariables): MutationRef<UpdatePackageTemplateData, UpdatePackageTemplateVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdatePackageTemplateVariables): MutationRef<UpdatePackageTemplateData, UpdatePackageTemplateVariables>;
  operationName: string;
}
export const updatePackageTemplateRef: UpdatePackageTemplateRef;

export function updatePackageTemplate(vars: UpdatePackageTemplateVariables): MutationPromise<UpdatePackageTemplateData, UpdatePackageTemplateVariables>;
export function updatePackageTemplate(dc: DataConnect, vars: UpdatePackageTemplateVariables): MutationPromise<UpdatePackageTemplateData, UpdatePackageTemplateVariables>;

interface TogglePackageTemplateActiveRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: TogglePackageTemplateActiveVariables): MutationRef<TogglePackageTemplateActiveData, TogglePackageTemplateActiveVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: TogglePackageTemplateActiveVariables): MutationRef<TogglePackageTemplateActiveData, TogglePackageTemplateActiveVariables>;
  operationName: string;
}
export const togglePackageTemplateActiveRef: TogglePackageTemplateActiveRef;

export function togglePackageTemplateActive(vars: TogglePackageTemplateActiveVariables): MutationPromise<TogglePackageTemplateActiveData, TogglePackageTemplateActiveVariables>;
export function togglePackageTemplateActive(dc: DataConnect, vars: TogglePackageTemplateActiveVariables): MutationPromise<TogglePackageTemplateActiveData, TogglePackageTemplateActiveVariables>;

