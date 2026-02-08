import Mustache from 'mustache';
import { Profile, Template } from '../types';

// Helper to preprocess data for Mustache (e.g., adding 'last' flag for lists)
const preprocessData = (profile: Profile) => {
  const processList = <T>(list: T[] = []) => {
    return list.map((item, index) => ({
      ...item,
      first: index === 0,
      last: index === list.length - 1,
      index: index,
      indexPlusOne: index + 1,
    }));
  };

  // Filter experiences by type for backward compatibility templates
  const educationList = profile.experiences.filter(e => e.type === 'education');
  const workList = profile.experiences.filter(e => e.type === 'work');
  
  // If no new experiences found, fallback to old arrays (though we migrated, just in case)
  // Actually, we migrated, so experiences should have everything.
  // But let's support both accessing 'experiences' (all) and 'education'/'work' (filtered).

  return {
    basic: profile.basic,
    experiences: processList(profile.experiences), // All experiences sorted by user input order (or store order)
    education: processList(educationList), // Filtered for convenience
    work: processList(workList),           // Filtered for convenience
    family: processList(profile.family),
  };
};

export const generateOutput = (profile: Profile, template: Template): string => {
  const data = preprocessData(profile);
  // Disable HTML escaping for plain text generation
  const output = Mustache.render(template.content, data, {}, ['{{', '}}']);
  // Mustache by default escapes HTML entities. For code/text generation, we usually don't want that.
  // However, Mustache.render usually escapes. 
  // To avoid escaping, we can use {{{ key }}} in template, or override escape function.
  
  // A better way is to override the escape function for this render
  // But Mustache.render doesn't accept options for escape.
  // We can use Mustache.parse and then writer, but simplest is to use {{{ }}} in templates
  // OR, we can just unescape common entities if we use {{ }}.
  
  // Let's use a custom Render if needed, but for now, let's assume standard behavior.
  // Wait, for JSON generation, we definitely don't want HTML escaping (like " becoming &quot;).
  // So we should instruct users to use {{{ }}} or handle it here.
  
  // Actually, simpler hack:
  const originalEscape = Mustache.escape;
  Mustache.escape = (text) => text; // Disable escaping globally for this operation
  const result = Mustache.render(template.content, data);
  Mustache.escape = originalEscape; // Restore
  
  return result;
};
