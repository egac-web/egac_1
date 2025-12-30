import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// Manually load .env file
const envFile = readFileSync(resolve(process.cwd(), '.env'), 'utf-8');
const envVars = {};
envFile.split('\n').forEach(line => {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) {
    envVars[match[1].trim()] = match[2].trim();
  }
});

const supabaseUrl = envVars.SUPABASE_URL || envVars.PUBLIC_SUPABASE_URL;
const supabaseKey = envVars.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env file');
  console.error('   SUPABASE_URL:', !!supabaseUrl);
  console.error('   SUPABASE_SERVICE_ROLE_KEY:', !!supabaseKey);
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testEnquiryPersistence() {
  console.log('🧪 Testing Supabase enquiry persistence with subject fields...\n');

  const testEmail = `test-agent-${Date.now()}@example.com`;
  const testData = {
    enquiry_type: 'Training',
    enquiry_for: 'someone_else',
    first_name: 'Test',
    last_name: 'Parent',
    email: testEmail,
    contact_phone: '07700900123',
    subject_first_name: 'Child',
    subject_last_name: 'Runner',
    subject_dob: '2010-05-15',
    note: 'Automated test - Subject: Child Runner, DOB: 2010-05-15'
  };

  try {
    // 1. Insert test enquiry
    console.log('📝 Inserting test enquiry...');
    const { data: inserted, error: insertError } = await supabase
      .from('enquiries')
      .insert(testData)
      .select()
      .single();

    if (insertError) {
      console.error('❌ Insert failed:', insertError);
      return false;
    }

    console.log('✅ Inserted enquiry ID:', inserted.id);
    console.log('   Email:', inserted.email);
    console.log('   Enquiry for:', inserted.enquiry_for);
    console.log('   Subject first name:', inserted.subject_first_name);
    console.log('   Subject last name:', inserted.subject_last_name);
    console.log('   Subject DOB:', inserted.subject_dob);
    console.log('   Note:', inserted.note);

    // 2. Verify the data persisted correctly
    console.log('\n🔍 Reading back inserted record...');
    const { data: fetched, error: fetchError } = await supabase
      .from('enquiries')
      .select('*')
      .eq('email', testEmail)
      .single();

    if (fetchError) {
      console.error('❌ Fetch failed:', fetchError);
      return false;
    }

    console.log('✅ Fetched enquiry successfully');

    // 3. Verify subject fields
    const checks = [
      { field: 'subject_first_name', expected: 'Child', actual: fetched.subject_first_name },
      { field: 'subject_last_name', expected: 'Runner', actual: fetched.subject_last_name },
      { field: 'subject_dob', expected: '2010-05-15', actual: fetched.subject_dob },
      { field: 'enquiry_for', expected: 'someone_else', actual: fetched.enquiry_for },
      { field: 'contact_phone', expected: '07700900123', actual: fetched.contact_phone }
    ];

    console.log('\n✓ Verification:');
    let allPassed = true;
    for (const check of checks) {
      const passed = check.actual === check.expected;
      allPassed = allPassed && passed;
      console.log(`  ${passed ? '✅' : '❌'} ${check.field}: ${check.actual} ${passed ? '' : `(expected: ${check.expected})`}`);
    }

    // 4. Cleanup
    console.log('\n🧹 Cleaning up test data...');
    const { error: deleteError } = await supabase
      .from('enquiries')
      .delete()
      .eq('id', inserted.id);

    if (deleteError) {
      console.error('❌ Delete failed:', deleteError);
      console.log('⚠️  Manual cleanup required for enquiry ID:', inserted.id);
    } else {
      console.log('✅ Test record deleted');
    }

    console.log('\n' + (allPassed ? '✅ All tests passed!' : '❌ Some tests failed'));
    return allPassed;

  } catch (error) {
    console.error('\n❌ Unexpected error:', error);
    return false;
  }
}

testEnquiryPersistence()
  .then(success => process.exit(success ? 0 : 1))
  .catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
  });
