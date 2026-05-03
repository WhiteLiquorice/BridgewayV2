# Basic Usage

Always prioritize using a supported framework over using the generated SDK
directly. Supported frameworks simplify the developer experience and help ensure
best practices are followed.





## Advanced Usage
If a user is not using a supported framework, they can use the generated SDK directly.

Here's an example of how to use it with the first 5 operations:

```js
import { getUserProfile, getOrgSettings, getOrgProfiles, updateProfileStatus, createOrgProfile, updateOrgBranding, updateOrgSettings, createOrg, provisionProfile, provisionOrgSetting } from '@bridgeway/database';


// Operation GetUserProfile: 
const { data } = await GetUserProfile(dataConnect);

// Operation GetOrgSettings:  For variables, look at type GetOrgSettingsVars in ../index.d.ts
const { data } = await GetOrgSettings(dataConnect, getOrgSettingsVars);

// Operation GetOrgProfiles:  For variables, look at type GetOrgProfilesVars in ../index.d.ts
const { data } = await GetOrgProfiles(dataConnect, getOrgProfilesVars);

// Operation UpdateProfileStatus:  For variables, look at type UpdateProfileStatusVars in ../index.d.ts
const { data } = await UpdateProfileStatus(dataConnect, updateProfileStatusVars);

// Operation CreateOrgProfile:  For variables, look at type CreateOrgProfileVars in ../index.d.ts
const { data } = await CreateOrgProfile(dataConnect, createOrgProfileVars);

// Operation UpdateOrgBranding:  For variables, look at type UpdateOrgBrandingVars in ../index.d.ts
const { data } = await UpdateOrgBranding(dataConnect, updateOrgBrandingVars);

// Operation UpdateOrgSettings:  For variables, look at type UpdateOrgSettingsVars in ../index.d.ts
const { data } = await UpdateOrgSettings(dataConnect, updateOrgSettingsVars);

// Operation CreateOrg:  For variables, look at type CreateOrgVars in ../index.d.ts
const { data } = await CreateOrg(dataConnect, createOrgVars);

// Operation ProvisionProfile:  For variables, look at type ProvisionProfileVars in ../index.d.ts
const { data } = await ProvisionProfile(dataConnect, provisionProfileVars);

// Operation ProvisionOrgSetting:  For variables, look at type ProvisionOrgSettingVars in ../index.d.ts
const { data } = await ProvisionOrgSetting(dataConnect, provisionOrgSettingVars);


```