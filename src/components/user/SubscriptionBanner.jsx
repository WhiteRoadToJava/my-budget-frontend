import React, { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { getMySubscription } from "../../api/subscriptionService";
import { SUPPORT_WHATSAPP, bannerFor, whatsappLink } from "../../utils/subscription/subscription";
import { dateFnsLocale, toCalendarDay } from "../../utils/dates";
import styles from "../../styles/components/admin/subscriptionBanner.module.scss";
import i18n from "../../configuration/i18n";

// Top of every user page: shown in the last week, during the grace days and when
// the app is read only. The link opens WhatsApp with a message ready to send.
const SubscriptionBanner = () => {
  const queryClient = useQueryClient();
  const { data: info } = useQuery({
    queryKey: ["subscription"],
    queryFn: getMySubscription,
    staleTime: 5 * 60 * 1000,
  });

  // a change refused with 402 means the state changed: read it again
  useEffect(() => {
    const refresh = () => queryClient.invalidateQueries({ queryKey: ["subscription"] });
    window.addEventListener("subscription-expired", refresh);
    return () => window.removeEventListener("subscription-expired", refresh);
  }, [queryClient]);

  const banner = bannerFor(info);
  if (!banner) return null;

  const endsAt = toCalendarDay(info.endsAt);
  const values = {
    date: endsAt ? format(endsAt, "d MMMM yyyy", { locale: dateFnsLocale(i18n.language) }) : "",
    days: info.daysLeft,
  };
  const link = whatsappLink(SUPPORT_WHATSAPP, i18n.t("subscription.whatsappMessage"));

  return (
    <div className={styles.banner} data-tone={banner.tone} role={banner.tone === "error" ? "alert" : "status"}>
      <p className={styles.text}>{i18n.t(banner.key, values)}</p>
      {link && (
        <a className={styles.action} href={link} target="_blank" rel="noopener noreferrer">
          {i18n.t("subscription.renew")}
        </a>
      )}
    </div>
  );
};

export default SubscriptionBanner;
