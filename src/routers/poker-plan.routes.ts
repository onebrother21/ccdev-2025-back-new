import express from 'express';
import { pokerPlanController } from '../controllers';
import { AuthJWT } from '../middlewares';
import { Routes } from './routeStrings';
import { pokerPlanValidators } from '../validators';

const router = express.Router();
router.post(Routes.pokerPlans,[AuthJWT,...pokerPlanValidators.CreatePokerPlan,pokerPlanController.CreatePokerPlan]);
router.get(Routes.pokerPlanId,[AuthJWT,pokerPlanController.GetPokerPlan]);
router.put(Routes.pokerPlanId,[AuthJWT,...pokerPlanValidators.UpdatePokerPlan,pokerPlanController.UpdatePokerPlan]);

router.post(Routes.addVenuesToPokerPlan,[AuthJWT,pokerPlanController.AddVenuesToPokerPlan]);
router.put(Routes.updatePokerVenue,[AuthJWT,pokerPlanController.UpdatePokerVenue]);
router.delete(Routes.removeVenueFromPokerPlan,[AuthJWT,pokerPlanController.RemoveVenueFromPokerPlan]);
router.post(Routes.addEntriesToPokerPlan,[AuthJWT,pokerPlanController.AddEntriesToPokerPlan]);
router.put(Routes.updatePokerEntry,[AuthJWT,pokerPlanController.UpdatePokerEntry]);
router.delete(Routes.removeEntryFromPokerPlan,[AuthJWT,pokerPlanController.RemoveEntryFromPokerPlan]);

export default router;