;;; edit-stream-info.el --- Edit Twitch Streams -*- lexical-binding: t; -*-
;;
;;; Commentary:
;;; Code:

(require 'org)
(require 'org-element)
(require 'cl-macs)
(require 'request)

(defun first--header-and-content ()
  "Get first header and it's content current buffer."
  (let ((bb))
    (block bb
      (org-element-map (org-element-parse-buffer) 'headline
        (lambda (headline)
          (let ((contents-begin (org-element-property :contents-begin headline))
                (contents-end (org-element-property :contents-end headline)))
            (return-from bb
              (list
               (org-element-property :raw-value headline)
               (buffer-substring contents-begin (- contents-end 1))))))))))

(defun first-header-and-content-buffer ()
  "Get first header and it's content from current buffer."
  (interactive)
  (with-current-buffer
      (current-buffer)
    (first-header-and-content)))


(defun twitch--update-json (status)
  "Generate JSON body for the update STATUS request."
  (json-encode
   `(:channel
     (:status ,status
      :game "Science & Technology"
      :channel_feed_enabled t))))

(defun twitch--update-status (channel-id status)
  "Update twitch channel CHANNEL-ID with STATUS."
  (let ((client-id (getenv "TWITCH_CLIENT_ID"))
        (oauth-id (getenv "TWITCH_OAUTH_ID")))
    (request
      (format "https://api.twitch.tv/kraken/channels/%d" channel-id)
      :sync t
      :type "PUT"
      :headers `(("Client-ID" . ,(format "%s" client-id))
                 ("Authorization" . ,(format "OAuth %s" oauth-id))
                 ("Accept" . "application/vnd.twitchtv.v5+json")
                 ("Content-Type" . "application/json"))
      :parser 'json-read
      :data (twitch--update-json status)
      :success (cl-function
                (lambda (&key data &allow-other-keys)
                  (message "I sent: %S" (assoc-default 'headers data))))
      :error
      (cl-function (lambda (&rest args &key error-thrown &allow-other-keys)
                     (pp error-thrown))))))

(defun twitch-update ()
  "Update twitch channel status with first header of current org file."
  (interactive)
  (let ((status (nth 1 (first--header-and-content)))
        (channel-id 145377094))
    (twitch--update-status channel-id status)))


;; TESTING
(with-temp-buffer
  (insert "
* Hacking Emacs Lisp

Connecting emacs, elisp, org-mode and twitch.

Learning how to parse org mode.
")
  (twitch-update))

(twitch--update-status  145377094 "Goin on three seconds.")

(provide 'edit-stream-info)

;;; edit-stream-info.el ends here
