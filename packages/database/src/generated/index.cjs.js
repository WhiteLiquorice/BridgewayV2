const { queryRef, executeQuery, validateArgsWithOptions, mutationRef, executeMutation, validateArgs } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'default',
  service: 'bridgeway-db',
  location: 'us-central1'
};
exports.connectorConfig = connectorConfig;

const getUserProfileRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetUserProfile');
}
getUserProfileRef.operationName = 'GetUserProfile';
exports.getUserProfileRef = getUserProfileRef;

exports.getUserProfile = function getUserProfile(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(getUserProfileRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const getOrgSettingsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetOrgSettings', inputVars);
}
getOrgSettingsRef.operationName = 'GetOrgSettings';
exports.getOrgSettingsRef = getOrgSettingsRef;

exports.getOrgSettings = function getOrgSettings(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getOrgSettingsRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const getOrgProfilesRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetOrgProfiles', inputVars);
}
getOrgProfilesRef.operationName = 'GetOrgProfiles';
exports.getOrgProfilesRef = getOrgProfilesRef;

exports.getOrgProfiles = function getOrgProfiles(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getOrgProfilesRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const updateProfileStatusRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateProfileStatus', inputVars);
}
updateProfileStatusRef.operationName = 'UpdateProfileStatus';
exports.updateProfileStatusRef = updateProfileStatusRef;

exports.updateProfileStatus = function updateProfileStatus(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateProfileStatusRef(dcInstance, inputVars));
}
;

const createOrgProfileRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateOrgProfile', inputVars);
}
createOrgProfileRef.operationName = 'CreateOrgProfile';
exports.createOrgProfileRef = createOrgProfileRef;

exports.createOrgProfile = function createOrgProfile(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createOrgProfileRef(dcInstance, inputVars));
}
;

const updateOrgBrandingRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateOrgBranding', inputVars);
}
updateOrgBrandingRef.operationName = 'UpdateOrgBranding';
exports.updateOrgBrandingRef = updateOrgBrandingRef;

exports.updateOrgBranding = function updateOrgBranding(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateOrgBrandingRef(dcInstance, inputVars));
}
;

const updateOrgSettingsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateOrgSettings', inputVars);
}
updateOrgSettingsRef.operationName = 'UpdateOrgSettings';
exports.updateOrgSettingsRef = updateOrgSettingsRef;

exports.updateOrgSettings = function updateOrgSettings(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateOrgSettingsRef(dcInstance, inputVars));
}
;

const createOrgRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateOrg', inputVars);
}
createOrgRef.operationName = 'CreateOrg';
exports.createOrgRef = createOrgRef;

exports.createOrg = function createOrg(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createOrgRef(dcInstance, inputVars));
}
;

const provisionProfileRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'ProvisionProfile', inputVars);
}
provisionProfileRef.operationName = 'ProvisionProfile';
exports.provisionProfileRef = provisionProfileRef;

exports.provisionProfile = function provisionProfile(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(provisionProfileRef(dcInstance, inputVars));
}
;

const provisionOrgSettingRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'ProvisionOrgSetting', inputVars);
}
provisionOrgSettingRef.operationName = 'ProvisionOrgSetting';
exports.provisionOrgSettingRef = provisionOrgSettingRef;

exports.provisionOrgSetting = function provisionOrgSetting(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(provisionOrgSettingRef(dcInstance, inputVars));
}
;

const getAdminDashboardStatsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetAdminDashboardStats', inputVars);
}
getAdminDashboardStatsRef.operationName = 'GetAdminDashboardStats';
exports.getAdminDashboardStatsRef = getAdminDashboardStatsRef;

exports.getAdminDashboardStats = function getAdminDashboardStats(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getAdminDashboardStatsRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const getBookingPageDataRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetBookingPageData', inputVars);
}
getBookingPageDataRef.operationName = 'GetBookingPageData';
exports.getBookingPageDataRef = getBookingPageDataRef;

exports.getBookingPageData = function getBookingPageData(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getBookingPageDataRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const getAppointmentsForDayRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetAppointmentsForDay', inputVars);
}
getAppointmentsForDayRef.operationName = 'GetAppointmentsForDay';
exports.getAppointmentsForDayRef = getAppointmentsForDayRef;

exports.getAppointmentsForDay = function getAppointmentsForDay(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getAppointmentsForDayRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const getBookingByIdRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetBookingById', inputVars);
}
getBookingByIdRef.operationName = 'GetBookingById';
exports.getBookingByIdRef = getBookingByIdRef;

exports.getBookingById = function getBookingById(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getBookingByIdRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const createBookingRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateBooking', inputVars);
}
createBookingRef.operationName = 'CreateBooking';
exports.createBookingRef = createBookingRef;

exports.createBooking = function createBooking(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createBookingRef(dcInstance, inputVars));
}
;

const updateBookingRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateBooking', inputVars);
}
updateBookingRef.operationName = 'UpdateBooking';
exports.updateBookingRef = updateBookingRef;

exports.updateBooking = function updateBooking(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateBookingRef(dcInstance, inputVars));
}
;

const getUpcomingBookingsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetUpcomingBookings', inputVars);
}
getUpcomingBookingsRef.operationName = 'GetUpcomingBookings';
exports.getUpcomingBookingsRef = getUpcomingBookingsRef;

exports.getUpcomingBookings = function getUpcomingBookings(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getUpcomingBookingsRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const updateOrgGoogleCalendarRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateOrgGoogleCalendar', inputVars);
}
updateOrgGoogleCalendarRef.operationName = 'UpdateOrgGoogleCalendar';
exports.updateOrgGoogleCalendarRef = updateOrgGoogleCalendarRef;

exports.updateOrgGoogleCalendar = function updateOrgGoogleCalendar(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateOrgGoogleCalendarRef(dcInstance, inputVars));
}
;

const getClientByEmailRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetClientByEmail', inputVars);
}
getClientByEmailRef.operationName = 'GetClientByEmail';
exports.getClientByEmailRef = getClientByEmailRef;

exports.getClientByEmail = function getClientByEmail(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getClientByEmailRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const getClientByPhoneRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetClientByPhone', inputVars);
}
getClientByPhoneRef.operationName = 'GetClientByPhone';
exports.getClientByPhoneRef = getClientByPhoneRef;

exports.getClientByPhone = function getClientByPhone(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getClientByPhoneRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const getClientAppointmentsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetClientAppointments', inputVars);
}
getClientAppointmentsRef.operationName = 'GetClientAppointments';
exports.getClientAppointmentsRef = getClientAppointmentsRef;

exports.getClientAppointments = function getClientAppointments(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getClientAppointmentsRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const updateAppointmentStatusRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateAppointmentStatus', inputVars);
}
updateAppointmentStatusRef.operationName = 'UpdateAppointmentStatus';
exports.updateAppointmentStatusRef = updateAppointmentStatusRef;

exports.updateAppointmentStatus = function updateAppointmentStatus(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateAppointmentStatusRef(dcInstance, inputVars));
}
;

const getOrgAppointmentsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetOrgAppointments', inputVars);
}
getOrgAppointmentsRef.operationName = 'GetOrgAppointments';
exports.getOrgAppointmentsRef = getOrgAppointmentsRef;

exports.getOrgAppointments = function getOrgAppointments(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getOrgAppointmentsRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const createAppointmentRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateAppointment', inputVars);
}
createAppointmentRef.operationName = 'CreateAppointment';
exports.createAppointmentRef = createAppointmentRef;

exports.createAppointment = function createAppointment(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createAppointmentRef(dcInstance, inputVars));
}
;

const getActiveServicesRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetActiveServices', inputVars);
}
getActiveServicesRef.operationName = 'GetActiveServices';
exports.getActiveServicesRef = getActiveServicesRef;

exports.getActiveServices = function getActiveServices(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getActiveServicesRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const searchClientsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'SearchClients', inputVars);
}
searchClientsRef.operationName = 'SearchClients';
exports.searchClientsRef = searchClientsRef;

exports.searchClients = function searchClients(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(searchClientsRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const createServiceRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateService', inputVars);
}
createServiceRef.operationName = 'CreateService';
exports.createServiceRef = createServiceRef;

exports.createService = function createService(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createServiceRef(dcInstance, inputVars));
}
;

const getOrgClientsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetOrgClients', inputVars);
}
getOrgClientsRef.operationName = 'GetOrgClients';
exports.getOrgClientsRef = getOrgClientsRef;

exports.getOrgClients = function getOrgClients(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getOrgClientsRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const getClientDetailRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetClientDetail', inputVars);
}
getClientDetailRef.operationName = 'GetClientDetail';
exports.getClientDetailRef = getClientDetailRef;

exports.getClientDetail = function getClientDetail(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getClientDetailRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const createClientRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateClient', inputVars);
}
createClientRef.operationName = 'CreateClient';
exports.createClientRef = createClientRef;

exports.createClient = function createClient(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createClientRef(dcInstance, inputVars));
}
;

const updateClientRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateClient', inputVars);
}
updateClientRef.operationName = 'UpdateClient';
exports.updateClientRef = updateClientRef;

exports.updateClient = function updateClient(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateClientRef(dcInstance, inputVars));
}
;

const getOrgQueueRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetOrgQueue', inputVars);
}
getOrgQueueRef.operationName = 'GetOrgQueue';
exports.getOrgQueueRef = getOrgQueueRef;

exports.getOrgQueue = function getOrgQueue(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getOrgQueueRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const createQueueEntryRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateQueueEntry', inputVars);
}
createQueueEntryRef.operationName = 'CreateQueueEntry';
exports.createQueueEntryRef = createQueueEntryRef;

exports.createQueueEntry = function createQueueEntry(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createQueueEntryRef(dcInstance, inputVars));
}
;

const updateQueueStatusRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateQueueStatus', inputVars);
}
updateQueueStatusRef.operationName = 'UpdateQueueStatus';
exports.updateQueueStatusRef = updateQueueStatusRef;

exports.updateQueueStatus = function updateQueueStatus(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateQueueStatusRef(dcInstance, inputVars));
}
;

const deleteQueueEntryRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteQueueEntry', inputVars);
}
deleteQueueEntryRef.operationName = 'DeleteQueueEntry';
exports.deleteQueueEntryRef = deleteQueueEntryRef;

exports.deleteQueueEntry = function deleteQueueEntry(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(deleteQueueEntryRef(dcInstance, inputVars));
}
;

const getUpcomingOrgAppointmentsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetUpcomingOrgAppointments', inputVars);
}
getUpcomingOrgAppointmentsRef.operationName = 'GetUpcomingOrgAppointments';
exports.getUpcomingOrgAppointmentsRef = getUpcomingOrgAppointmentsRef;

exports.getUpcomingOrgAppointments = function getUpcomingOrgAppointments(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getUpcomingOrgAppointmentsRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const getSlotsForDayRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetSlotsForDay', inputVars);
}
getSlotsForDayRef.operationName = 'GetSlotsForDay';
exports.getSlotsForDayRef = getSlotsForDayRef;

exports.getSlotsForDay = function getSlotsForDay(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getSlotsForDayRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const getActivePackageTemplatesRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetActivePackageTemplates', inputVars);
}
getActivePackageTemplatesRef.operationName = 'GetActivePackageTemplates';
exports.getActivePackageTemplatesRef = getActivePackageTemplatesRef;

exports.getActivePackageTemplates = function getActivePackageTemplates(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getActivePackageTemplatesRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const createClientPackageRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateClientPackage', inputVars);
}
createClientPackageRef.operationName = 'CreateClientPackage';
exports.createClientPackageRef = createClientPackageRef;

exports.createClientPackage = function createClientPackage(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createClientPackageRef(dcInstance, inputVars));
}
;

const logActivityRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'LogActivity', inputVars);
}
logActivityRef.operationName = 'LogActivity';
exports.logActivityRef = logActivityRef;

exports.logActivity = function logActivity(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(logActivityRef(dcInstance, inputVars));
}
;

const getInAppNotificationsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetInAppNotifications', inputVars);
}
getInAppNotificationsRef.operationName = 'GetInAppNotifications';
exports.getInAppNotificationsRef = getInAppNotificationsRef;

exports.getInAppNotifications = function getInAppNotifications(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getInAppNotificationsRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const markNotificationReadRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'MarkNotificationRead', inputVars);
}
markNotificationReadRef.operationName = 'MarkNotificationRead';
exports.markNotificationReadRef = markNotificationReadRef;

exports.markNotificationRead = function markNotificationRead(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(markNotificationReadRef(dcInstance, inputVars));
}
;

const getPosProductsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetPosProducts', inputVars);
}
getPosProductsRef.operationName = 'GetPosProducts';
exports.getPosProductsRef = getPosProductsRef;

exports.getPosProducts = function getPosProducts(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getPosProductsRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const getProductsForInventoryRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetProductsForInventory', inputVars);
}
getProductsForInventoryRef.operationName = 'GetProductsForInventory';
exports.getProductsForInventoryRef = getProductsForInventoryRef;

exports.getProductsForInventory = function getProductsForInventory(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getProductsForInventoryRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const createProductRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateProduct', inputVars);
}
createProductRef.operationName = 'CreateProduct';
exports.createProductRef = createProductRef;

exports.createProduct = function createProduct(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createProductRef(dcInstance, inputVars));
}
;

const updateProductRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateProduct', inputVars);
}
updateProductRef.operationName = 'UpdateProduct';
exports.updateProductRef = updateProductRef;

exports.updateProduct = function updateProduct(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateProductRef(dcInstance, inputVars));
}
;

const updateProductStockRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateProductStock', inputVars);
}
updateProductStockRef.operationName = 'UpdateProductStock';
exports.updateProductStockRef = updateProductStockRef;

exports.updateProductStock = function updateProductStock(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateProductStockRef(dcInstance, inputVars));
}
;

const createPosTransactionRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreatePosTransaction', inputVars);
}
createPosTransactionRef.operationName = 'CreatePosTransaction';
exports.createPosTransactionRef = createPosTransactionRef;

exports.createPosTransaction = function createPosTransaction(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createPosTransactionRef(dcInstance, inputVars));
}
;

const getStaffShiftsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetStaffShifts', inputVars);
}
getStaffShiftsRef.operationName = 'GetStaffShifts';
exports.getStaffShiftsRef = getStaffShiftsRef;

exports.getStaffShifts = function getStaffShifts(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getStaffShiftsRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const createStaffShiftRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateStaffShift', inputVars);
}
createStaffShiftRef.operationName = 'CreateStaffShift';
exports.createStaffShiftRef = createStaffShiftRef;

exports.createStaffShift = function createStaffShift(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createStaffShiftRef(dcInstance, inputVars));
}
;

const deleteStaffShiftRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteStaffShift', inputVars);
}
deleteStaffShiftRef.operationName = 'DeleteStaffShift';
exports.deleteStaffShiftRef = deleteStaffShiftRef;

exports.deleteStaffShift = function deleteStaffShift(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(deleteStaffShiftRef(dcInstance, inputVars));
}
;

const getUpcomingSlotsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetUpcomingSlots', inputVars);
}
getUpcomingSlotsRef.operationName = 'GetUpcomingSlots';
exports.getUpcomingSlotsRef = getUpcomingSlotsRef;

exports.getUpcomingSlots = function getUpcomingSlots(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getUpcomingSlotsRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const getAvailableSlotsForBookingRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetAvailableSlotsForBooking', inputVars);
}
getAvailableSlotsForBookingRef.operationName = 'GetAvailableSlotsForBooking';
exports.getAvailableSlotsForBookingRef = getAvailableSlotsForBookingRef;

exports.getAvailableSlotsForBooking = function getAvailableSlotsForBooking(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getAvailableSlotsForBookingRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const createSlotRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateSlot', inputVars);
}
createSlotRef.operationName = 'CreateSlot';
exports.createSlotRef = createSlotRef;

exports.createSlot = function createSlot(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createSlotRef(dcInstance, inputVars));
}
;

const updateSlotStatusRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateSlotStatus', inputVars);
}
updateSlotStatusRef.operationName = 'UpdateSlotStatus';
exports.updateSlotStatusRef = updateSlotStatusRef;

exports.updateSlotStatus = function updateSlotStatus(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateSlotStatusRef(dcInstance, inputVars));
}
;

const deleteSlotRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteSlot', inputVars);
}
deleteSlotRef.operationName = 'DeleteSlot';
exports.deleteSlotRef = deleteSlotRef;

exports.deleteSlot = function deleteSlot(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(deleteSlotRef(dcInstance, inputVars));
}
;

const getClassesRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetClasses', inputVars);
}
getClassesRef.operationName = 'GetClasses';
exports.getClassesRef = getClassesRef;

exports.getClasses = function getClasses(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getClassesRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const getActiveClassesForBookingRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetActiveClassesForBooking', inputVars);
}
getActiveClassesForBookingRef.operationName = 'GetActiveClassesForBooking';
exports.getActiveClassesForBookingRef = getActiveClassesForBookingRef;

exports.getActiveClassesForBooking = function getActiveClassesForBooking(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getActiveClassesForBookingRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const createClassRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateClass', inputVars);
}
createClassRef.operationName = 'CreateClass';
exports.createClassRef = createClassRef;

exports.createClass = function createClass(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createClassRef(dcInstance, inputVars));
}
;

const updateClassRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateClass', inputVars);
}
updateClassRef.operationName = 'UpdateClass';
exports.updateClassRef = updateClassRef;

exports.updateClass = function updateClass(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateClassRef(dcInstance, inputVars));
}
;

const updateClassActiveStatusRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateClassActiveStatus', inputVars);
}
updateClassActiveStatusRef.operationName = 'UpdateClassActiveStatus';
exports.updateClassActiveStatusRef = updateClassActiveStatusRef;

exports.updateClassActiveStatus = function updateClassActiveStatus(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateClassActiveStatusRef(dcInstance, inputVars));
}
;

const getClassRegistrationsForReportsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetClassRegistrationsForReports', inputVars);
}
getClassRegistrationsForReportsRef.operationName = 'GetClassRegistrationsForReports';
exports.getClassRegistrationsForReportsRef = getClassRegistrationsForReportsRef;

exports.getClassRegistrationsForReports = function getClassRegistrationsForReports(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getClassRegistrationsForReportsRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const getClassesForReportsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetClassesForReports', inputVars);
}
getClassesForReportsRef.operationName = 'GetClassesForReports';
exports.getClassesForReportsRef = getClassesForReportsRef;

exports.getClassesForReports = function getClassesForReports(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getClassesForReportsRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const getExistingRegistrationRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetExistingRegistration', inputVars);
}
getExistingRegistrationRef.operationName = 'GetExistingRegistration';
exports.getExistingRegistrationRef = getExistingRegistrationRef;

exports.getExistingRegistration = function getExistingRegistration(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getExistingRegistrationRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const getClassRegistrationsCountRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetClassRegistrationsCount', inputVars);
}
getClassRegistrationsCountRef.operationName = 'GetClassRegistrationsCount';
exports.getClassRegistrationsCountRef = getClassRegistrationsCountRef;

exports.getClassRegistrationsCount = function getClassRegistrationsCount(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getClassRegistrationsCountRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const createClassRegistrationRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateClassRegistration', inputVars);
}
createClassRegistrationRef.operationName = 'CreateClassRegistration';
exports.createClassRegistrationRef = createClassRegistrationRef;

exports.createClassRegistration = function createClassRegistration(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createClassRegistrationRef(dcInstance, inputVars));
}
;

const getWidgetConfigRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetWidgetConfig', inputVars);
}
getWidgetConfigRef.operationName = 'GetWidgetConfig';
exports.getWidgetConfigRef = getWidgetConfigRef;

exports.getWidgetConfig = function getWidgetConfig(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getWidgetConfigRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const upsertWidgetConfigRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpsertWidgetConfig', inputVars);
}
upsertWidgetConfigRef.operationName = 'UpsertWidgetConfig';
exports.upsertWidgetConfigRef = upsertWidgetConfigRef;

exports.upsertWidgetConfig = function upsertWidgetConfig(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(upsertWidgetConfigRef(dcInstance, inputVars));
}
;

const getAppointmentsForReportsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetAppointmentsForReports', inputVars);
}
getAppointmentsForReportsRef.operationName = 'GetAppointmentsForReports';
exports.getAppointmentsForReportsRef = getAppointmentsForReportsRef;

exports.getAppointmentsForReports = function getAppointmentsForReports(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getAppointmentsForReportsRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const getClientsForReportsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetClientsForReports', inputVars);
}
getClientsForReportsRef.operationName = 'GetClientsForReports';
exports.getClientsForReportsRef = getClientsForReportsRef;

exports.getClientsForReports = function getClientsForReports(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getClientsForReportsRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const updateProfileInfoRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateProfileInfo', inputVars);
}
updateProfileInfoRef.operationName = 'UpdateProfileInfo';
exports.updateProfileInfoRef = updateProfileInfoRef;

exports.updateProfileInfo = function updateProfileInfo(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateProfileInfoRef(dcInstance, inputVars));
}
;

const getActiveIntakeTemplatesRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetActiveIntakeTemplates', inputVars);
}
getActiveIntakeTemplatesRef.operationName = 'GetActiveIntakeTemplates';
exports.getActiveIntakeTemplatesRef = getActiveIntakeTemplatesRef;

exports.getActiveIntakeTemplates = function getActiveIntakeTemplates(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getActiveIntakeTemplatesRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const getIntakeSubmissionsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetIntakeSubmissions', inputVars);
}
getIntakeSubmissionsRef.operationName = 'GetIntakeSubmissions';
exports.getIntakeSubmissionsRef = getIntakeSubmissionsRef;

exports.getIntakeSubmissions = function getIntakeSubmissions(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getIntakeSubmissionsRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const createIntakeSubmissionRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateIntakeSubmission', inputVars);
}
createIntakeSubmissionRef.operationName = 'CreateIntakeSubmission';
exports.createIntakeSubmissionRef = createIntakeSubmissionRef;

exports.createIntakeSubmission = function createIntakeSubmission(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createIntakeSubmissionRef(dcInstance, inputVars));
}
;

const getClientDocumentsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetClientDocuments', inputVars);
}
getClientDocumentsRef.operationName = 'GetClientDocuments';
exports.getClientDocumentsRef = getClientDocumentsRef;

exports.getClientDocuments = function getClientDocuments(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getClientDocumentsRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const updateClientPackageSessionsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateClientPackageSessions', inputVars);
}
updateClientPackageSessionsRef.operationName = 'UpdateClientPackageSessions';
exports.updateClientPackageSessionsRef = updateClientPackageSessionsRef;

exports.updateClientPackageSessions = function updateClientPackageSessions(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateClientPackageSessionsRef(dcInstance, inputVars));
}
;

const getAnnouncementsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetAnnouncements', inputVars);
}
getAnnouncementsRef.operationName = 'GetAnnouncements';
exports.getAnnouncementsRef = getAnnouncementsRef;

exports.getAnnouncements = function getAnnouncements(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getAnnouncementsRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const createAnnouncementRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateAnnouncement', inputVars);
}
createAnnouncementRef.operationName = 'CreateAnnouncement';
exports.createAnnouncementRef = createAnnouncementRef;

exports.createAnnouncement = function createAnnouncement(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createAnnouncementRef(dcInstance, inputVars));
}
;

const deleteAnnouncementRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteAnnouncement', inputVars);
}
deleteAnnouncementRef.operationName = 'DeleteAnnouncement';
exports.deleteAnnouncementRef = deleteAnnouncementRef;

exports.deleteAnnouncement = function deleteAnnouncement(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(deleteAnnouncementRef(dcInstance, inputVars));
}
;

const getClassRegistrationsForAttendanceRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetClassRegistrationsForAttendance', inputVars);
}
getClassRegistrationsForAttendanceRef.operationName = 'GetClassRegistrationsForAttendance';
exports.getClassRegistrationsForAttendanceRef = getClassRegistrationsForAttendanceRef;

exports.getClassRegistrationsForAttendance = function getClassRegistrationsForAttendance(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getClassRegistrationsForAttendanceRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const updateClassRegistrationStatusRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateClassRegistrationStatus', inputVars);
}
updateClassRegistrationStatusRef.operationName = 'UpdateClassRegistrationStatus';
exports.updateClassRegistrationStatusRef = updateClassRegistrationStatusRef;

exports.updateClassRegistrationStatus = function updateClassRegistrationStatus(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateClassRegistrationStatusRef(dcInstance, inputVars));
}
;

const getClientsForRetentionRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetClientsForRetention', inputVars);
}
getClientsForRetentionRef.operationName = 'GetClientsForRetention';
exports.getClientsForRetentionRef = getClientsForRetentionRef;

exports.getClientsForRetention = function getClientsForRetention(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getClientsForRetentionRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const getCompletedAppointmentsForRetentionRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetCompletedAppointmentsForRetention', inputVars);
}
getCompletedAppointmentsForRetentionRef.operationName = 'GetCompletedAppointmentsForRetention';
exports.getCompletedAppointmentsForRetentionRef = getCompletedAppointmentsForRetentionRef;

exports.getCompletedAppointmentsForRetention = function getCompletedAppointmentsForRetention(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getCompletedAppointmentsForRetentionRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const getOrgClientPackagesRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetOrgClientPackages', inputVars);
}
getOrgClientPackagesRef.operationName = 'GetOrgClientPackages';
exports.getOrgClientPackagesRef = getOrgClientPackagesRef;

exports.getOrgClientPackages = function getOrgClientPackages(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getOrgClientPackagesRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const getFloorLayoutRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetFloorLayout', inputVars);
}
getFloorLayoutRef.operationName = 'GetFloorLayout';
exports.getFloorLayoutRef = getFloorLayoutRef;

exports.getFloorLayout = function getFloorLayout(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getFloorLayoutRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const assignSeatRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AssignSeat', inputVars);
}
assignSeatRef.operationName = 'AssignSeat';
exports.assignSeatRef = assignSeatRef;

exports.assignSeat = function assignSeat(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(assignSeatRef(dcInstance, inputVars));
}
;

const clearSeatRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'ClearSeat', inputVars);
}
clearSeatRef.operationName = 'ClearSeat';
exports.clearSeatRef = clearSeatRef;

exports.clearSeat = function clearSeat(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(clearSeatRef(dcInstance, inputVars));
}
;

const getTodayFloorAppointmentsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetTodayFloorAppointments', inputVars);
}
getTodayFloorAppointmentsRef.operationName = 'GetTodayFloorAppointments';
exports.getTodayFloorAppointmentsRef = getTodayFloorAppointmentsRef;

exports.getTodayFloorAppointments = function getTodayFloorAppointments(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getTodayFloorAppointmentsRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const getUnconfirmedAppointmentsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetUnconfirmedAppointments', inputVars);
}
getUnconfirmedAppointmentsRef.operationName = 'GetUnconfirmedAppointments';
exports.getUnconfirmedAppointmentsRef = getUnconfirmedAppointmentsRef;

exports.getUnconfirmedAppointments = function getUnconfirmedAppointments(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getUnconfirmedAppointmentsRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const getPendingOrgBookingsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetPendingOrgBookings', inputVars);
}
getPendingOrgBookingsRef.operationName = 'GetPendingOrgBookings';
exports.getPendingOrgBookingsRef = getPendingOrgBookingsRef;

exports.getPendingOrgBookings = function getPendingOrgBookings(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getPendingOrgBookingsRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const getOrgWaitlistRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetOrgWaitlist', inputVars);
}
getOrgWaitlistRef.operationName = 'GetOrgWaitlist';
exports.getOrgWaitlistRef = getOrgWaitlistRef;

exports.getOrgWaitlist = function getOrgWaitlist(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getOrgWaitlistRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const getOrgActivityLogsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetOrgActivityLogs', inputVars);
}
getOrgActivityLogsRef.operationName = 'GetOrgActivityLogs';
exports.getOrgActivityLogsRef = getOrgActivityLogsRef;

exports.getOrgActivityLogs = function getOrgActivityLogs(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getOrgActivityLogsRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const getOrgPosTransactionsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetOrgPosTransactions', inputVars);
}
getOrgPosTransactionsRef.operationName = 'GetOrgPosTransactions';
exports.getOrgPosTransactionsRef = getOrgPosTransactionsRef;

exports.getOrgPosTransactions = function getOrgPosTransactions(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getOrgPosTransactionsRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const getOrgByIdRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetOrgById', inputVars);
}
getOrgByIdRef.operationName = 'GetOrgById';
exports.getOrgByIdRef = getOrgByIdRef;

exports.getOrgById = function getOrgById(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getOrgByIdRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const updateOrgStripeCredentialsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateOrgStripeCredentials', inputVars);
}
updateOrgStripeCredentialsRef.operationName = 'UpdateOrgStripeCredentials';
exports.updateOrgStripeCredentialsRef = updateOrgStripeCredentialsRef;

exports.updateOrgStripeCredentials = function updateOrgStripeCredentials(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateOrgStripeCredentialsRef(dcInstance, inputVars));
}
;

const updateProfileCommissionRateRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateProfileCommissionRate', inputVars);
}
updateProfileCommissionRateRef.operationName = 'UpdateProfileCommissionRate';
exports.updateProfileCommissionRateRef = updateProfileCommissionRateRef;

exports.updateProfileCommissionRate = function updateProfileCommissionRate(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateProfileCommissionRateRef(dcInstance, inputVars));
}
;

const getOrgIntakeTemplatesRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetOrgIntakeTemplates', inputVars);
}
getOrgIntakeTemplatesRef.operationName = 'GetOrgIntakeTemplates';
exports.getOrgIntakeTemplatesRef = getOrgIntakeTemplatesRef;

exports.getOrgIntakeTemplates = function getOrgIntakeTemplates(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getOrgIntakeTemplatesRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const createIntakeTemplateRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateIntakeTemplate', inputVars);
}
createIntakeTemplateRef.operationName = 'CreateIntakeTemplate';
exports.createIntakeTemplateRef = createIntakeTemplateRef;

exports.createIntakeTemplate = function createIntakeTemplate(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createIntakeTemplateRef(dcInstance, inputVars));
}
;

const updateIntakeTemplateRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateIntakeTemplate', inputVars);
}
updateIntakeTemplateRef.operationName = 'UpdateIntakeTemplate';
exports.updateIntakeTemplateRef = updateIntakeTemplateRef;

exports.updateIntakeTemplate = function updateIntakeTemplate(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateIntakeTemplateRef(dcInstance, inputVars));
}
;

const deleteIntakeTemplateRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteIntakeTemplate', inputVars);
}
deleteIntakeTemplateRef.operationName = 'DeleteIntakeTemplate';
exports.deleteIntakeTemplateRef = deleteIntakeTemplateRef;

exports.deleteIntakeTemplate = function deleteIntakeTemplate(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(deleteIntakeTemplateRef(dcInstance, inputVars));
}
;

const getOrgServicesRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetOrgServices', inputVars);
}
getOrgServicesRef.operationName = 'GetOrgServices';
exports.getOrgServicesRef = getOrgServicesRef;

exports.getOrgServices = function getOrgServices(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getOrgServicesRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const updateServiceRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateService', inputVars);
}
updateServiceRef.operationName = 'UpdateService';
exports.updateServiceRef = updateServiceRef;

exports.updateService = function updateService(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateServiceRef(dcInstance, inputVars));
}
;

const toggleServiceArchiveRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'ToggleServiceArchive', inputVars);
}
toggleServiceArchiveRef.operationName = 'ToggleServiceArchive';
exports.toggleServiceArchiveRef = toggleServiceArchiveRef;

exports.toggleServiceArchive = function toggleServiceArchive(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(toggleServiceArchiveRef(dcInstance, inputVars));
}
;

const getMarketingTriggersRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetMarketingTriggers', inputVars);
}
getMarketingTriggersRef.operationName = 'GetMarketingTriggers';
exports.getMarketingTriggersRef = getMarketingTriggersRef;

exports.getMarketingTriggers = function getMarketingTriggers(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getMarketingTriggersRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const createMarketingTriggerRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateMarketingTrigger', inputVars);
}
createMarketingTriggerRef.operationName = 'CreateMarketingTrigger';
exports.createMarketingTriggerRef = createMarketingTriggerRef;

exports.createMarketingTrigger = function createMarketingTrigger(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createMarketingTriggerRef(dcInstance, inputVars));
}
;

const updateMarketingTriggerRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateMarketingTrigger', inputVars);
}
updateMarketingTriggerRef.operationName = 'UpdateMarketingTrigger';
exports.updateMarketingTriggerRef = updateMarketingTriggerRef;

exports.updateMarketingTrigger = function updateMarketingTrigger(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateMarketingTriggerRef(dcInstance, inputVars));
}
;

const getNotificationSettingsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetNotificationSettings', inputVars);
}
getNotificationSettingsRef.operationName = 'GetNotificationSettings';
exports.getNotificationSettingsRef = getNotificationSettingsRef;

exports.getNotificationSettings = function getNotificationSettings(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getNotificationSettingsRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const upsertNotificationSettingsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpsertNotificationSettings', inputVars);
}
upsertNotificationSettingsRef.operationName = 'UpsertNotificationSettings';
exports.upsertNotificationSettingsRef = upsertNotificationSettingsRef;

exports.upsertNotificationSettings = function upsertNotificationSettings(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(upsertNotificationSettingsRef(dcInstance, inputVars));
}
;

const updateOrgPatientCheckinRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateOrgPatientCheckin', inputVars);
}
updateOrgPatientCheckinRef.operationName = 'UpdateOrgPatientCheckin';
exports.updateOrgPatientCheckinRef = updateOrgPatientCheckinRef;

exports.updateOrgPatientCheckin = function updateOrgPatientCheckin(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateOrgPatientCheckinRef(dcInstance, inputVars));
}
;

const getOrgPackageTemplatesRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetOrgPackageTemplates', inputVars);
}
getOrgPackageTemplatesRef.operationName = 'GetOrgPackageTemplates';
exports.getOrgPackageTemplatesRef = getOrgPackageTemplatesRef;

exports.getOrgPackageTemplates = function getOrgPackageTemplates(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getOrgPackageTemplatesRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const createPackageTemplateRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreatePackageTemplate', inputVars);
}
createPackageTemplateRef.operationName = 'CreatePackageTemplate';
exports.createPackageTemplateRef = createPackageTemplateRef;

exports.createPackageTemplate = function createPackageTemplate(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createPackageTemplateRef(dcInstance, inputVars));
}
;

const updatePackageTemplateRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdatePackageTemplate', inputVars);
}
updatePackageTemplateRef.operationName = 'UpdatePackageTemplate';
exports.updatePackageTemplateRef = updatePackageTemplateRef;

exports.updatePackageTemplate = function updatePackageTemplate(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updatePackageTemplateRef(dcInstance, inputVars));
}
;

const togglePackageTemplateActiveRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'TogglePackageTemplateActive', inputVars);
}
togglePackageTemplateActiveRef.operationName = 'TogglePackageTemplateActive';
exports.togglePackageTemplateActiveRef = togglePackageTemplateActiveRef;

exports.togglePackageTemplateActive = function togglePackageTemplateActive(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(togglePackageTemplateActiveRef(dcInstance, inputVars));
}
;
