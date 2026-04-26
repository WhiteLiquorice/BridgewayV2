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
  return executeQuery(getUserProfileRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
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
  return executeQuery(getOrgSettingsRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
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
  return executeQuery(getOrgProfilesRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
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
