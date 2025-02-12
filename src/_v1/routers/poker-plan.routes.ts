import express from 'express';
import { pokerPlanController } from '../controllers';
import { pokerPlanValidators } from '../../validators';
import { AuthJWT } from '../../middlewares';

const router = express.Router();
router.post("/",[AuthJWT,...pokerPlanValidators.CreatePokerPlan,pokerPlanController.CreatePokerPlan]);
router.get("/:pokerPlanId",[AuthJWT,pokerPlanController.GetPokerPlan]);
router.put("/:pokerPlanId",[AuthJWT,...pokerPlanValidators.UpdatePokerPlan,pokerPlanController.UpdatePokerPlan]);

router.post("/:pokerPlanId/venues",[AuthJWT,pokerPlanController.AddVenuesToPokerPlan]);
router.put("/:pokerPlanId/venues/:venueName",[AuthJWT,pokerPlanController.UpdatePokerVenue]);
router.delete("/:pokerPlanId/venues/:venueName",[AuthJWT,pokerPlanController.RemoveVenueFromPokerPlan]);
router.post("/:pokerPlanId/entries",[AuthJWT,pokerPlanController.AddEntriesToPokerPlan]);
router.put("/:pokerPlanId/entries/:entryId",[AuthJWT,pokerPlanController.UpdatePokerEntry]);
router.delete("/:pokerPlanId/entries/:entryId",[AuthJWT,pokerPlanController.RemoveEntryFromPokerPlan]);

export default router;