<?php

namespace App\Handlers;

use App\AppTrait;
use App\Lib\AbstractHandler;
use App\Lib\Traits\DatabaseTrait;
use Webiny\Component\Mailer\MailerTrait;

class CronHandler extends AbstractHandler
{
    use DatabaseTrait, MailerTrait, AppTrait;

    // Available statuses
    const PENDING = 'pending';
    const COMPLETED = 'completed';

    // Available e-mail types
    const INACTIVITY_EMAIL = 'user_inactive';

    /**
     * This must execute and the end of the day, to check how many users were active and how many inactive
     */
    public function checkInactiveUsers()
    {
        $expiration = $this->app()->getConfig()->other->user_inactive_period;
        $query = "INSERT INTO w_email_queue (
                    SELECT id, ?, ? FROM w_user AS u WHERE last_login::DATE = (NOW()::DATE - INTERVAL '{$expiration} days'))";
        $bind = [
            self::INACTIVITY_EMAIL, self::PENDING
        ];
        $this->db()->execute($query, $bind);

        // Send mail to all registered inactive users
        $this->_sendInactivityEmail();

        // End of CRON
        $this->_endCron();
    }

    /**
     * Deletes tags that aren't used (count equals zero) - removing junk from database is useful :)
     */
    public function removeUnusedTags()
    {
        $query = "DELETE FROM {$this->db()->w_tags} WHERE count = 0";
        $this->db()->execute($query, []);

        // End of CRON
        $this->_endCron();
    }

    /**
     * Sends email to all inactive users (What's wrong with you guys?!)
     */
    private function _sendInactivityEmail()
    {
        // Firstly, get all users that haven't got our mail
        $query = "SELECT eq.*, u.first_name, u.last_name, u.email FROM {$this->db()->w_email_queue} eq
                    LEFT JOIN {$this->db()->w_user} u ON u.id = eq.user
                    WHERE eq.type=? AND eq.status=? ORDER BY u.email ASC";
        $bind = [self::INACTIVITY_EMAIL, self::PENDING];
        $users = $this->db()->execute($query, $bind)->fetchAll();

        // First, check if there are any users that need to get our e-mail
        if ($users->count()) {
            // TODO: Send mail using other mail service
        }

        // TODO: update queue
    }

    /**
     * Ends CRON script
     */
    private function _endCron() {
        die('Cron finished successfully.');
    }

}
