export const SCHOOL_NAME = '[School Name]';
export const ADMIN_CONTACT = '[Election admin name / office / email]';
export const RETENTION_TEXT = '[number] days after the final results are announced';

export default function PrivacyNotice() {
  return (
    <div className="privacy-notice">
      <h2>Privacy Notice</h2>
      <p>
        VOTOPIA is the online voting system for the Garcia College of Technology student council
        election. This notice explains what information we collect and how we use
        it, in line with the Data Privacy Act of 2012 (Republic Act No. 10173).
      </p>

      <h3>What we collect:</h3>
      <ul>
        <li>
          Your student ID, full name, course, and year/section, taken from the
          official student list.
        </li>
        <li>
          Your department from the official voter list, used to show you the
          correct department ballot.
        </li>
        <li>
          The 4-digit PIN your adviser gave you. It is stored in scrambled form,
          not as plain text.
        </li>
        <li>A record that you have voted (not what you chose).</li>
        <li>The date and time you agreed to this notice.</li>
      </ul>

      <h3>Your vote is secret:</h3>
      <p>
        Your choices on the ballot are saved without your name or student ID.
        No one, including the election admin, can see how you voted.
      </p>

      <h3>Why we use it:</h3>
      <p>
        To confirm that you are an enrolled student, let you vote only once,
        count the votes, and show the results.
      </p>

      <h3>Who can see it:</h3>
      <p>
        The election admin can see the student list. If you lose your PIN, the
        admin can look it up after entering their own password, and every lookup
        is recorded in a log. The results page shows totals only.
      </p>

      <h3>How long we keep it:</h3>
      <p>
        The student list and accounts are deleted {RETENTION_TEXT}. The vote totals
        are kept.
      </p>

      <h3>Your rights:</h3>
      <p>
        You may ask the election admin to show you what we keep about you, to
        correct a mistake in your name, course, or section, or to answer a concern
        about your data. Contact: SSC GCT.
      </p>
    </div>
  );
}
