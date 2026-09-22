import { TSettings } from './interface.settings';
import { Settings } from './model.settings';

// Singleton: there is always exactly one Settings document. Every read/write
// goes through an upsert against an empty filter instead of tracking an id.
const getSettings = async () => {
  const settings = await Settings.findOneAndUpdate({}, {}, { new: true, upsert: true });
  return settings;
};

const updateSettings = async (payload: Partial<TSettings>) => {
  const settings = await Settings.findOneAndUpdate({}, payload, {
    new: true,
    upsert: true,
    runValidators: true,
  });
  return settings;
};

export const settingsServices = {
  getSettings,
  updateSettings,
};
